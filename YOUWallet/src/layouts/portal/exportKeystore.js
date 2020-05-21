/**
 * Created by greason on 2019/4/16.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import _ from "lodash";
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
import RNFS from "react-native-fs";
import * as Animatable from "react-native-animatable";
import moment from "moment/moment";

import { device, screen } from "../../common/utils";
import theme from "../../common/theme";
import { Button, TouchImage } from "../../components/vendors";
import baseStyles from "../../styles/base";
import Nav from "../../components/common/nav";
import YCProgressHUD from "../../components/common/progress";
import * as Utils from "../../common/utils";
import BasePureLayout from "../../common/base/purelayout";
import configs from "../../common/configs";
import "../../common/xxtea";
import PasswordModal from "../../components/modal/passwordModal";
import YOUChainUtils from "../../common/youchainUtils";

const headerTopMargin = device.android ? 54 : device.ifiPhoneX(98, 74);
const bottomMargin = 0;
const offsetHeight = 1000;
const noticeHeight = 60;

let colors = theme.colors;
const styles = EStyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: colors.walletBg
  },
  contentWrapper: {
    marginTop: headerTopMargin,
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
  fakeEncryptedKey: {
    position: "absolute",
    left: 0,
    top: 0,
    fontSize: 16,
    color: "transparent",
    lineHeight: 18,
    fontFamily: "DINAlternate-Bold",
    marginLeft: 12,
    marginRight: 12
  },
  encryptedView: {
    marginTop: 20,
    marginBottom: 20,
    paddingTop: offsetHeight,
    backgroundColor: "#fff"
  },
  encryptedKey: {
    position: "absolute",
    left: 0,
    top: headerTopMargin + noticeHeight,
    fontSize: 16,
    color: "#3b3833",
    lineHeight: 18,
    fontFamily: "DINAlternate-Bold",
    marginLeft: 40,
    marginRight: 40
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
  infoContainerO: {
    position: "absolute",
    top: device.iPhoneX()
      ? headerTopMargin + 180
      : device.iOS ? headerTopMargin + 208 : headerTopMargin + 228,
    marginRight: 28,
    marginLeft: 28,
    bottom: 14
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

class ExportKeystore extends BasePureLayout {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      keyPassword: "",
      keyEncrypted: false,
      encryptedKey: "",
      encryptedKeyShow: false,
      height: 0,
      hidePassword: true,
      showEye: false,
      passwordModal: false
    };
    this._maxHeight = 0;
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
            title: "portal.chain.keystore.title",
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

  componentWillUnmount() {
    this._interval && clearInterval(this._interval);
    this._interval = null;
  }

  _onKeyPasswordInputChange = value => {
    this.setState({ keyPassword: value });
  };

  _onChangePasswordState = () => {
    this.setState({
      hidePassword: !this.state.hidePassword
    });
  };

  _validate = () => {
    return this.state.keyPassword.trim().length !== 0;
  };

  _onSubmit = () => {
    if (!Utils.regulars.chain.keyPassword.test(this.state.keyPassword)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }
    const { wallet } = this.props.state;
    let targetWallet = wallet.list[wallet.currentAddress];
    let password = this.state.keyPassword;
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

  _onExportKeyStore = exportPassword => {
    if (!Utils.regulars.chain.keyPassword.test(exportPassword)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }

    this.setState({
      passwordModal: false
    });

    YCProgressHUD.show();
    _.delay(() => {
      this.dismissKeyboard();

      new Promise((resolve, reject) => {
        YOUChainUtils.newInstance().exportKeyStore(exportPassword, keyStore => {
          resolve(keyStore);
        });
      })
        .then(keyStore => {
          YCProgressHUD.dismiss();
          const { wallet } = this.props.state;
          let targetWallet = wallet.list[wallet.currentAddress];
          let _encryptedKey = JSON.stringify({
            keyStore: keyStore,
            address: targetWallet.address,
            wallet: {
              name: targetWallet.name,
              notice: targetWallet.notice
            }
          });

          this.setState({ keyEncrypted: true, encryptedKey: _encryptedKey });
          _.delay(() => {
            const _height = device.iPhoneX()
              ? this._maxHeight + 20
              : device.iOS ? this._maxHeight - 10 : this._maxHeight - 30;
            this.setState({ height: this.state.height + _height });
            if (!this._interval) {
              let _top = 0;
              this._interval = setInterval(() => {
                _top += 30;
                if (_top <= _height + 15) {
                  this._extendView1 &&
                    this._extendView1.transitionTo(
                      {
                        translateY: _top
                      },
                      20
                    );
                  this._extendView2 &&
                    this._extendView2.transitionTo(
                      {
                        translateY: _top
                      },
                      20
                    );
                } else {
                  _top = 0;
                  this.setState({ encryptedKeyShow: true });
                  this._interval && clearInterval(this._interval);
                  this._interval = null;
                }
              }, 20);
            }
          }, device.iOS ? 300 : 500);
        })
        .catch(() => {});
    }, 100);
  };

  _onCopy = () => {
    Clipboard.setString(this.state.encryptedKey);
    YCProgressHUD.showSuccessWithStatus(this.i18n("common.copy-successful"));
  };

  _onDownload = () => {
    YCProgressHUD.show();
    const { wallet } = this.props.state;
    let address = wallet.currentAddress;
    const now = new Date().getTime();
    const time = moment(now).format("YYYYMMDDHHmmss");
    const path = device.iOS
      ? `${RNFS.DocumentDirectoryPath}/${time}${address}.key`
      : `${RNFS.ExternalStorageDirectoryPath}/YouChain/${time}${address}.key`;
    RNFS.writeFile(path, this.state.encryptedKey, "utf8")
      .then(success => {
        YCProgressHUD.showSuccessWithStatus(
          this.i18n("portal.chain.keystore.download-success", { value: path })
        );
      })
      .catch(error => {
        YCProgressHUD.showErrorWithStatus(
          this.i18n("portal.chain.keystore.download-failed")
        );
      });
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
      <View
        style={[
          { backgroundColor: colors.walletBg },
          this.state.height !== 0 && {
            height: this.state.height + this._maxHeight - bottomMargin
          }
        ]}
      >
        <Animatable.View
          ref={ref => (this._extendView1 = ref)}
          style={[styles.contentWrapper, { marginTop: -900 }]}
        >
          <Text
            style={styles.fakeEncryptedKey}
            onLayout={event => {
              this._maxHeight = event.nativeEvent.layout.height;
            }}
          >
            {this.state.encryptedKey}
          </Text>
          <View style={styles.encryptedView} />
          <View
            style={{
              width: screen.width - 60,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20
            }}
          >
            <Button
              containerViewStyle={{
                marginLeft: 0,
                marginRight: 0
              }}
              buttonStyle={[
                baseStyles.button,
                {
                  backgroundColor: colors.walletBg,
                  width: screen.width / 2 - 40
                }
              ]}
              title={this.i18n("portal.chain.keystore.copy")}
              textStyle={{ color: "#fff", fontWeight: "bold" }}
              fontSize={15}
              onPress={this._onCopy}
            />
            <Button
              containerViewStyle={{
                marginLeft: 0,
                marginRight: 0
              }}
              buttonStyle={[
                baseStyles.button,
                {
                  backgroundColor: "#FF3F6C",
                  width: screen.width / 2 - 40
                }
              ]}
              title={this.i18n("portal.chain.keystore.download")}
              textStyle={{ color: "#fff", fontWeight: "bold" }}
              fontSize={15}
              onPress={this._onDownload}
            />
          </View>
          <Text style={styles.tips}>{this.i18n("portal.chain.key.tips")}</Text>
        </Animatable.View>
        <View
          style={{
            backgroundColor: colors.walletBg,
            position: "absolute",
            width: screen.width,
            left: 0,
            top: -offsetHeight
          }}
        >
          <View style={{ height: offsetHeight }} />
          <View
            style={{
              marginTop: headerTopMargin,
              marginLeft: 14,
              marginRight: 14,
              paddingLeft: 14,
              paddingTop: 20,
              paddingRight: 14,
              paddingBottom: 14,
              backgroundColor: "#fff",
              borderTopRightRadius: 6,
              borderTopLeftRadius: 6,
              alignItems: "center"
            }}
          >
            <Text style={styles.notice}>
              {this.i18n("portal.chain.keystore.notice")}
            </Text>
          </View>
        </View>
        {this.state.encryptedKeyShow ? (
          <Animatable.Text
            style={styles.encryptedKey}
            animation={"fadeIn"}
            selectable={true}
          >
            {this.state.encryptedKey}
          </Animatable.Text>
        ) : null}
      </View>
    ) : (
      <View style={styles.contentWrapper}>
        <Text style={styles.notice}>
          {this.i18n("portal.chain.keystore.notice")}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            onChangeText={this._onKeyPasswordInputChange}
            value={this.state.keyPassword}
            placeholder={this.i18n("portal.chain.keystore.placeholder-key")}
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
    const _keyInfo = this.i18n("portal.chain.keystore.info.key");
    const _keyImage = [
      require("../../images/portal/chain/icon-save.png"),
      require("../../images/portal/chain/icon-close.png"),
      require("../../images/portal/chain/icon-box.png"),
      require("../../images/portal/chain/icon-lock.png")
    ];
    return (
      <Animatable.View
        style={
          this.state.keyEncrypted
            ? [
                styles.infoContainerO,
                this.state.height !== 0 && { height: this.state.height }
              ]
            : [styles.infoContainer]
        }
        ref={ref => (this._extendView2 = ref)}
        onLayout={event => {
          this.setState({ height: event.nativeEvent.layout.height });
        }}
      >
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
        <Text style={styles.bottomNotice}>
          {this.i18n("portal.chain.keystore.tips")}
        </Text>
      </Animatable.View>
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
          {this._renderKeyContent()}
          {this._renderInfo()}
        </KeyboardAwareScrollView>
        {this._renderNavigation()}
        {this.state.passwordModal ? (
          <PasswordModal
            title={this.i18n("portal.chain.keystore.input-password")}
            onConfirm={this._onExportKeyStore}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExportKeystore);
