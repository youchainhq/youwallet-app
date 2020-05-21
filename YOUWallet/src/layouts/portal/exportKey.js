/**
 * Created by greason on 2019/4/16.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Animated,
  Clipboard,
  Image
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import QRCode from "react-native-qrcode-svg";
import * as Animatable from "react-native-animatable";

import { device, screen } from "../../common/utils";
import theme from "../../common/theme";
import { TouchText, Button, TouchImage } from "../../components/vendors";
import baseStyles from "../../styles/base";
import Nav from "../../components/common/nav";
import YCProgressHUD from "../../components/common/progress";
import * as Utils from "../../common/utils";
import BasePureLayout from "../../common/base/purelayout";
import "../../common/xxtea";
import YOUChainUtils from "../../common/youchainUtils";
import PasswordModal from "../../components/modal/passwordModal";
import configs from "../../common/configs";

const headerTopMargin = device.android ? 54 : device.ifiPhoneX(98, 74);

let colors = theme.colors;
const styles = EStyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: colors.walletBg
  },
  titleWrapper: {
    flexDirection: "row",
    marginLeft: 46,
    marginRight: 46,
    justifyContent: "space-between",
    marginTop: headerTopMargin
  },
  titleItem: {
    width: 112,
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    paddingBottom: 8,
    alignItems: "center"
  },
  title: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold"
  },
  contentWrapper: {
    marginTop: 14,
    marginLeft: 14,
    marginRight: 14,
    paddingTop: 20,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 6,
    alignItems: "center"
  },
  notice: {
    fontSize: 12,
    color: "#B48E50",
    lineHeight: 14
  },
  centerContainer: {
    flexDirection: "row",
    minHeight: 110,
    alignItems: "center"
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4F8",
    paddingLeft: 14,
    paddingTop: device.iOS ? 8 : 2,
    paddingBottom: device.iOS ? 8 : 2,
    marginTop: 28,
    marginBottom: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F1F1F3",
    alignItems: "center",
    width: screen.width - 60
  },
  inputStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "#3b3833",
    backgroundColor: "#F4F4F8",
    fontSize: 14,
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  encryptedKey: {
    fontSize: 16,
    color: "#3b3833",
    lineHeight: 18,
    fontFamily: "DINAlternate-Bold",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 12,
    marginRight: 12
  },
  qrContainer: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20
  },
  tips: {
    fontSize: 12,
    color: "#B1AFAD",
    lineHeight: 14
  },
  infoContainer: {
    marginLeft: 28,
    marginRight: 28,
    marginBottom: 14
  },
  infoTitleContainer: {
    flexDirection: "row",
    marginTop: 28
  },
  infoTitle: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 16,
    textAlignVertical: "center",
    fontWeight: "bold",
    marginLeft: 8,
    width: screen.width - 78
  },
  infoContent: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 17,
    marginTop: 8
  },
  bottomNotice: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 19,
    fontWeight: "bold",
    marginTop: 26,
    ...device.ifiPhoneX({ marginBottom: 24 }, { marginBottom: 0 })
  }
});

class ExportKey extends BasePureLayout {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      keyEnable: true,
      keyPassword: "",
      codePassword: "",
      keyEncrypted: false,
      encryptedKey: "",
      codeEncrypted: false,
      encryptedCode: "",
      hidePassword: true,
      passwordModal: false
    };
  }

  _renderNavigation = () => {
    return (
      <Animated.View
        style={{
          position: "absolute"
        }}
      >
        <Nav
          navigationOptions={{
            title: "portal.chain.key.title",
            left: true,
            noBorder: true,
            noBg: true,
            containerStyle: { backgroundColor: colors.walletBg },
            goBack: () => {
              this.onGoBack();
            }
          }}
        />
      </Animated.View>
    );
  };

  componentDidMount() {}

  _onKeyPress = () => {
    this.setState({ keyEnable: true });
  };

  _onCodePress = () => {
    this.setState({ keyEnable: false });
  };

  _onKeyPasswordInputChange = value => {
    this.setState({ keyPassword: value });
  };

  _onCodePasswordInputChange = value => {
    this.setState({ codePassword: value });
  };

  _onChangePasswordState = () => {
    this.setState({
      hidePassword: !this.state.hidePassword
    });
  };

  _validate = () => {
    if (this.state.keyEnable) {
      return this.state.keyPassword.trim().length !== 0;
    } else {
      return this.state.codePassword.trim().length !== 0;
    }
  };

  _onSubmit = () => {
    if (this.state.keyEnable) {
      if (!Utils.regulars.chain.keyPassword.test(this.state.keyPassword)) {
        YCProgressHUD.showErrorWithStatus(
          this.i18n("portal.chain.wrong-password")
        );
        return;
      }
    } else {
      if (!Utils.regulars.chain.keyPassword.test(this.state.codePassword)) {
        YCProgressHUD.showErrorWithStatus(
          this.i18n("portal.chain.wrong-password")
        );
        return;
      }
    }
    const { wallet } = this.props.state;
    let targetWallet = wallet.list[wallet.currentAddress];
    let password;
    if (this.state.keyEnable) {
      password = this.state.keyPassword;
    } else {
      password = this.state.codePassword;
    }
    if (password !== targetWallet.password) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.error-password")
      );
      return;
    }
    this.setState({
      passwordModal: true
    });
    this.dismissKeyboard();
  };

  _onExportKey = exportPassword => {
    if (!Utils.regulars.chain.keyPassword.test(exportPassword)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }

    this.setState({
      passwordModal: false
    });

    const { wallet } = this.props.state;
    let targetWallet = wallet.list[wallet.currentAddress];
    let password;
    if (this.state.keyEnable) {
      password = this.state.keyPassword;
    } else {
      password = this.state.codePassword;
    }
    YOUChainUtils.newInstance().exportPrivateKey(password, privateKey => {
      const key = JSON.stringify({
        private: privateKey,
        address: targetWallet.address,
        wallet: {
          name: targetWallet.name,
          notice: targetWallet.notice
        }
      });
      let _encryptedKey = Utils.encryptData(key, exportPassword);
      if (this.state.keyEnable) {
        this.setState({ keyEncrypted: true, encryptedKey: _encryptedKey });
      } else {
        this.setState({ codeEncrypted: true, encryptedCode: _encryptedKey });
      }
    });
  };

  _onCopy = () => {
    Clipboard.setString(this.state.encryptedKey);
    YCProgressHUD.showSuccessWithStatus(this.i18n("common.copy-successful"));
  };

  _onScroll = ({ nativeEvent: { contentOffset } }) => {
    let newOpacity = 1;
    const fixedHeight = device.android ? 44 : device.ifiPhoneX(88, 64);
    const gap = headerTopMargin - fixedHeight;
    if (contentOffset.y > gap) {
      newOpacity = 1;
    } else if (contentOffset.y >= 0) {
      newOpacity = contentOffset.y / gap;
    } else {
      newOpacity = 0;
    }
    this.state.opacity.setValue(newOpacity);
  };

  _renderKeyContent = () => {
    return this.state.keyEncrypted ? (
      <View style={styles.contentWrapper}>
        <Text style={styles.notice}>
          {this.i18n("portal.chain.key.notice")}
        </Text>
        <View style={styles.centerContainer}>
          <Animatable.Text
            style={styles.encryptedKey}
            animation={"fadeIn"}
            selectable={true}
          >
            {this.state.encryptedKey}
          </Animatable.Text>
        </View>
        <Button
          buttonStyle={[
            baseStyles.button,
            {
              backgroundColor: colors.walletBg,
              marginBottom: 20,
              width: screen.width - 140,
              alignSelf: "center"
            }
          ]}
          title={this.i18n("portal.chain.key.copy")}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
          fontSize={15}
          onPress={this._onCopy}
        />
        <Text style={styles.tips}>{this.i18n("portal.chain.key.tips")}</Text>
      </View>
    ) : (
      <View style={styles.contentWrapper}>
        <Text style={styles.notice}>
          {this.i18n("portal.chain.key.notice")}
        </Text>
        <View style={styles.centerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={this._onKeyPasswordInputChange}
              value={this.state.keyPassword}
              placeholder={this.i18n("portal.chain.key.placeholder-key")}
              placeholderTextColor={"#B1AFAD"}
              returnKeyType={"send"}
              onSubmitEditing={this._onSubmit}
              numberOfLines={1}
              underlineColorAndroid="transparent"
              enablesReturnKeyAutomatically
              maxLength={20}
              selectionColor={colors.walletBg}
              secureTextEntry={this.state.hidePassword}
              onFocus={() => {
                this.setState({ showEye: true });
              }}
              onBlur={() => {
                this.setState({ showEye: false });
              }}
            />
            {this.state.showEye ? (
              <TouchImage
                source={
                  this.state.hidePassword
                    ? require("../../images/portal/chain/icon-eye-hide.png")
                    : require("../../images/portal/chain/icon-eye.png")
                }
                style={{
                  padding: 8
                }}
                onPress={this._onChangePasswordState}
              />
            ) : null}
          </View>
        </View>
        <Button
          buttonStyle={[
            baseStyles.button,
            {
              backgroundColor: colors.walletBg,
              marginBottom: 20,
              width: screen.width - 140,
              alignSelf: "center"
            }
          ]}
          title={this.i18n("common.confirm")}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
          fontSize={15}
          onPress={this._onSubmit}
          disabled={!this._validate()}
          disabledStyle={{ backgroundColor: "#C882F8" }}
        />
        <Text style={styles.tips}>
          {this.i18n("portal.chain.key.password-tips")}
        </Text>
      </View>
    );
  };

  _renderCodeContent = () => {
    return this.state.codeEncrypted ? (
      <View style={styles.contentWrapper}>
        <Text style={styles.notice}>
          {this.i18n("portal.chain.key.notice")}
        </Text>
        <View style={[styles.centerContainer, { minHeight: 160 }]}>
          <Animatable.View style={styles.qrContainer} animation={"fadeIn"}>
            <QRCode
              value={this.state.encryptedCode}
              size={140}
              backgroundColor="white"
              color="black"
            />
          </Animatable.View>
        </View>
        <Text style={styles.tips}>{this.i18n("portal.chain.key.tips")}</Text>
      </View>
    ) : (
      <View style={styles.contentWrapper}>
        <Text style={styles.notice}>
          {this.i18n("portal.chain.key.notice")}
        </Text>
        <View style={styles.centerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={this._onCodePasswordInputChange}
              value={this.state.codePassword}
              placeholder={this.i18n("portal.chain.key.placeholder-key")}
              placeholderTextColor={"#B1AFAD"}
              returnKeyType={"send"}
              onSubmitEditing={this._onSubmit}
              numberOfLines={1}
              underlineColorAndroid="transparent"
              enablesReturnKeyAutomatically
              maxLength={20}
              selectionColor={colors.walletBg}
              secureTextEntry={this.state.hidePassword}
              onFocus={() => {
                this.setState({ showEye: true });
              }}
              onBlur={() => {
                this.setState({ showEye: false });
              }}
            />
            {this.state.showEye ? (
              <TouchImage
                source={
                  this.state.hidePassword
                    ? require("../../images/portal/chain/icon-eye-hide.png")
                    : require("../../images/portal/chain/icon-eye.png")
                }
                style={{
                  padding: 8
                }}
                onPress={this._onChangePasswordState}
              />
            ) : null}
          </View>
        </View>
        <Button
          buttonStyle={[
            baseStyles.button,
            {
              backgroundColor: colors.walletBg,
              marginBottom: 20,
              width: screen.width - 140,
              alignSelf: "center"
            }
          ]}
          title={this.i18n("common.confirm")}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
          fontSize={15}
          onPress={this._onSubmit}
          disabled={!this._validate()}
          disabledStyle={{ backgroundColor: "#C882F8" }}
        />
        <Text style={styles.tips}>
          {this.i18n("portal.chain.key.password-tips")}
        </Text>
      </View>
    );
  };

  _renderInfo = () => {
    const _keyInfo = this.state.keyEnable
      ? this.i18n("portal.chain.key.info.key")
      : this.i18n("portal.chain.key.info.code");
    const _keyImage = this.state.keyEnable
      ? [
          require("../../images/portal/chain/icon-save.png"),
          require("../../images/portal/chain/icon-close.png"),
          require("../../images/portal/chain/icon-box.png"),
          require("../../images/portal/chain/icon-lock.png")
        ]
      : [
          require("../../images/portal/chain/icon-scan.png"),
          require("../../images/portal/chain/icon-confirm.png"),
          require("../../images/portal/chain/icon-box.png")
        ];
    return (
      <View style={styles.infoContainer}>
        {_keyInfo.map((item, key) => {
          return (
            <View key={key}>
              <View style={styles.infoTitleContainer}>
                <Image source={_keyImage[key]} />
                <Text style={styles.infoTitle}>{item.title}</Text>
              </View>
              <Text style={styles.infoContent}>{item.content}</Text>
            </View>
          );
        })}
        {this.state.keyEnable ? (
          <Text style={styles.bottomNotice}>
            {this.i18n("portal.chain.key.tips")}
          </Text>
        ) : null}
      </View>
    );
  };

  view() {
    return (
      <View style={styles.contentContainer}>
        <KeyboardAwareScrollView
          innerRef={ref => {
            this._scrollView = ref;
          }}
          scrollEventThrottle={1}
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator
          style={styles.contentContainer}
          onScroll={this._onScroll}
        >
          <View style={styles.titleWrapper}>
            <TouchText
              containerStyle={[
                styles.titleItem,
                {
                  borderBottomColor: this.state.keyEnable
                    ? "#fff"
                    : "transparent"
                }
              ]}
              textStyle={styles.title}
              onPress={this._onKeyPress}
              title={this.i18n("portal.chain.key.key")}
            />
            <TouchText
              containerStyle={[
                styles.titleItem,
                {
                  borderBottomColor: this.state.keyEnable
                    ? "transparent"
                    : "#fff"
                }
              ]}
              textStyle={[styles.title]}
              onPress={this._onCodePress}
              title={this.i18n("portal.chain.key.qrcode")}
            />
          </View>
          {this.state.keyEnable
            ? this._renderKeyContent()
            : this._renderCodeContent()}
          {this._renderInfo()}
        </KeyboardAwareScrollView>
        {this._renderNavigation()}
        {this.state.passwordModal ? (
          <PasswordModal
            title={this.i18n("portal.chain.key.input-password")}
            onConfirm={this._onExportKey}
            onCancel={() => {
              this.dismissKeyboard();
              this.setState({
                passwordModal: false
              });
            }}
          />
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportKey);
