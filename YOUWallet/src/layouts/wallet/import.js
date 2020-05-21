/**
 * Created by greason on 2019/4/12.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import React from "react";
import BasePureLayout from "../../common/base/purelayout";
import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  Linking,
  DeviceEventEmitter
} from "react-native";
import FormInputAdapt, {
  INPUT_MODE
} from "../../components/vendors/form/formInputAdapt";
import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import EStyleSheet from "react-native-extended-stylesheet";
import YCProgressHUD from "../../components/common/progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImportModal from "../../components/modal/importModal";
import { device, screen } from "../../common/utils";
import { regulars } from "../../common/utils";
import TouchImage from "../../components/vendors/image";
import PasswordModal from "../../components/modal/passwordModal";
import YOUChainUtils from "../../common/youchainUtils";
import * as Utils from "../../common/utils";
import configs from "../../common/configs";
import _ from "lodash";
import * as youchains from "youchain-utils";
import BipUtils from "../../common/bipUtils";

let colors = theme.colors;
let contentWidth = 273;
const styles = EStyleSheet.create({
  inputContainer: {
    flex: 0,
    width: contentWidth,
    height: 55,
    paddingLeft: 14,
    borderColor: "#f5f5f5",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center"
  },
  placeholderStyle: {
    width: contentWidth,
    textAlign: "left",
    fontSize: 13,
    color: "#898885",
    height: 45,
    paddingTop: 20
  }
});

class Import extends BasePureLayout {
  constructor(props) {
    super(props);

    this.state = {
      type: this.i18n("wallet.import.types")[0],
      key: "",
      password: "",
      importModal: false,
      passwordModal: false
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  navigationOptions(navigation) {
    return {
      title: " ",
      disableLocale: true,
      left: true,
      noBg: true,
      noBorder: true,
      containerStyle: { backgroundColor: colors.walletBg },
      goBack: () => {
        navigation.goBack();
      }
    };
  }

  _onShowQRScanner = () => {
    this.dismissKeyboard();
    this.props.navigation.navigate("QRScanner", {
      readDataFromQRScanner: (data, navigation) => {
        if (data && regulars.url.test(data)) {
          navigation.replace("Web", {
            title: "scanner.result",
            url: data
          });
          return true;
        } else if (data) {
          this.setState({ key: data });
          navigation.goBack();
          return true;
        } else {
          navigation.goBack();
          return false;
        }
      }
    });
  };

  canSubmit = () => {
    if (this.state.type.key === "mnemonic") {
      return this.state.key;
    } else if (!this.state.key || !this.state.password) {
      return false;
    }
    return true;
  };

  importData = () => {
    if (!Utils.regulars.chain.keyPassword.test(this.state.password)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }

    this.setState({ passwordModal: true });
  };

  importAccount = (type, key, password, importPassword) => {
    const { wallet } = this.props.state;
    let currentLength = Object.keys(wallet.list).length;

    if (type === "mnemonic") {
      let newKey = _.filter(key.split(" "), item => {
        return !!item;
      }).join(" ");
      if (BipUtils.validateMnemonic(newKey)) {
        let privateKey = BipUtils.createAccountAtIndex(newKey);
        YOUChainUtils.newInstance().findAccount(
          privateKey,
          (address, privateKey) => {
            if (wallet.list) {
              let target = wallet.list[address];
              if (target) {
                YCProgressHUD.showInfoWithStatus(
                  this.i18n("wallet.import.wallet-exist")
                );
                return;
              }
            }

            this.props.navigation.navigate("WalletCreate", {
              wallet: {
                mnemonic: newKey,
                address: address,
                privateKey: privateKey
              },
              from: "Import"
            });
          }
        );
      } else {
        YCProgressHUD.showErrorWithStatus(
          this.i18n("wallet.create.mnemonic-error")
        );
      }
      return;
    }

    if (!Utils.regulars.chain.keyPassword.test(importPassword)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }

    if (type === "key") {
      try {
        key = Utils.decryptData(key, importPassword);
      } catch (e) {
        YCProgressHUD.showErrorWithStatus(
          this.i18n("portal.chain.error-password")
        );
        return;
      }
    }

    let info;
    try {
      info = JSON.parse(key);
    } catch (e) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.error-content", {
          type: this.state.type.value
        })
      );
      return;
    }
    if (
      (type === "key" && !info.private) ||
      (type === "keystore" && !info.keyStore) ||
      !info.address ||
      !youchains.isAddress(info.address)
    ) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("wallet.import.wallet-not-exist")
      );
      return;
    }

    if (wallet.list) {
      let target = wallet.list[info.address];
      if (target) {
        YCProgressHUD.showInfoWithStatus(
          this.i18n("wallet.import.wallet-exist")
        );
        return;
      }
    }

    this.setState({
      passwordModal: false
    });
    YCProgressHUD.show();

    if (type === "key") {
      YOUChainUtils.newInstance().importPrivateKey(
        info.private,
        (address, privateKey) => {
          let newWallet = {
            name: info.wallet.name,
            password: password,
            notice: info.wallet.notice,
            address: address,
            privateKey: privateKey,
            avatar: Utils.getRandomAvatar()
          };

          this.props.actions.createWallet({ wallet: newWallet });

          YCProgressHUD.showSuccessWithStatus(
            this.i18n("wallet.import.import-successful")
          );

          if (currentLength > 0) {
            this.props.navigation.goBack();
          } else {
            DeviceEventEmitter.emit(
              configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
              {}
            );
          }
        }
      );
    } else if (type === "keystore") {
      _.delay(() => {
        this.dismissKeyboard();
        new Promise((resolve, reject) => {
          YOUChainUtils.newInstance().importKeyStore(
            JSON.parse(info.keyStore),
            importPassword,
            (address, privateKey, error) => {
              if (!error) {
                resolve(address, privateKey);
              } else {
                reject(error);
              }
            }
          );
        })
          .then((address, privateKey) => {
            let newWallet = {
              name: info.wallet.name,
              password: password,
              notice: info.wallet.notice,
              address: address,
              privateKey: privateKey,
              avatar: Utils.getRandomAvatar()
            };
            this.props.actions.createWallet({ wallet: newWallet });

            YCProgressHUD.showSuccessWithStatus(
              this.i18n("wallet.import.import-successful")
            );

            if (currentLength > 0) {
              this.props.navigation.goBack();
            } else {
              DeviceEventEmitter.emit(
                configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
                {}
              );
            }
          })
          .catch(() => {
            YCProgressHUD.showErrorWithStatus(
              this.i18n("portal.chain.error-password")
            );
          });
      }, 100);
    }
  };

  createUI = () => {
    let title = this.state.type.value;

    return (
      <ImageBackground
        source={require("../../images/wallet/import/wallet-import-bg.png")}
        style={{
          width: screen.width,
          minHeight: 491,
          marginTop: -4,
          paddingTop: 16,
          alignSelf: "center",
          alignItems: "center"
        }}
      >
        <Text
          style={[
            styles.placeholderStyle,
            {
              marginTop: 12
            }
          ]}
        >
          {this.i18n("wallet.import.import-type")}
        </Text>
        <TouchableOpacity
          style={[
            styles.inputContainer,
            { flexDirection: "row", alignItems: "center" }
          ]}
          onPress={() => {
            this.setState({ importModal: true });
          }}
          activeOpacity={0.8}
        >
          <Text
            style={[
              {
                flex: 1,
                textAlign: "left",
                fontWeight: "bold",
                color: "#3b3833",
                fontSize: 16
              }
            ]}
          >
            {title}
          </Text>
          <Image
            style={[{ width: 9, height: 9, marginRight: 15 }]}
            source={require("../../images/wallet/import/icon-arrow-down.png")}
          />
        </TouchableOpacity>
        <View
          style={[
            {
              flexDirection: "row",
              width: contentWidth,
              height: 45,
              paddingTop: 20
            }
          ]}
        >
          <Text
            style={{
              flex: 1,
              textAlign: "left",
              textAlignVertical: "top",
              fontSize: 13,
              color: "#898885"
            }}
          >
            {title}
          </Text>
          {this.state.type.key === "key" ? (
            <TouchImage
              style={{
                width: 24,
                height: 24,
                paddingTop: 0,
                paddingBottom: 0
              }}
              onPress={this._onShowQRScanner}
              source={require("../../images/wallet/import/icon-qr.png")}
            />
          ) : null}
        </View>
        <FormInputAdapt
          containerStyle={[
            baseStyles.inputContainer,
            styles.inputContainer,
            { height: 72, paddingRight: 14 }
          ]}
          inputStyle={[
            baseStyles.inputStyle,
            {
              textAlign: "left",
              fontWeight: "bold",
              fontSize: 12
            }
          ]}
          placeholder={
            this.state.type.key === "mnemonic"
              ? this.i18n("wallet.import.mnemonic.placeholder")
              : ""
          }
          placeholderStyle={{
            paddingLeft: 10,
            fontSize: 12,
            color: "#b1afad",
            top: 0
          }}
          selectionColor={colors.selectionColor}
          onChangeText={value => {
            this.setState({
              key: this.state.type.key === "mnemonic" ? value : value.trim()
            });
          }}
          inputMode={INPUT_MODE.MULTI}
          value={this.state.key}
          returnKeyType={"next"}
        />
        {this.state.type.key === "mnemonic" ? null : (
          <Text style={[styles.placeholderStyle]}>
            {this.i18n("wallet.import.import-password")}
          </Text>
        )}
        {this.state.type.key === "mnemonic" ? null : (
          <FormInputAdapt
            containerStyle={[
              baseStyles.inputContainer,
              styles.inputContainer,
              { marginBottom: 14 }
            ]}
            inputStyle={[
              baseStyles.inputStyle,
              {
                textAlign: "left",
                fontWeight: "bold"
              }
            ]}
            selectionColor={colors.selectionColor}
            onChangeText={value => {
              this.setState({
                password: value
              });
            }}
            value={this.state.password}
            secureTextEntry={true}
            maxLength={20}
            returnKeyType={"next"}
            placeholder={this.i18n("portal.chain.key.placeholder-key")}
            placeholderStyle={{
              paddingLeft: 10,
              color: "#9D9B99",
              fontSize: 15
            }}
          />
        )}

        <TouchableOpacity
          style={{
            position: "absolute",
            left: (screen.width - 68) / 2,
            bottom: device.android ? 44 : 36,
            flexDirection: "row",
            alignSelf: "center",
            width: 68,
            height: 68,
            borderRadius: 68 / 2,
            backgroundColor: this.canSubmit()
              ? "rgba(146,6,241,1.0)"
              : "rgba(146,6,241,0.5)",
            alignItems: "center",
            justifyContent: "center",
            marginTop: device.android ? 30 : 28,
            shadowColor: "rgba(181, 6, 241, 0.42)",
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1
          }}
          activeOpacity={0.8}
          onPress={() => {
            if (!this.canSubmit()) {
              return;
            }
            if (this.state.type.key === "mnemonic") {
              this.importAccount(
                this.state.type.key,
                this.state.key,
                this.state.password,
                ""
              );
              return;
            }
            this.importData();
          }}
        >
          <Image
            source={require("../../images/wallet/create/create-arrow.png")}
            style={{ width: 22, height: 18 }}
          />
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  view() {
    let pwTitle;
    if (this.state.type.key === "key") {
      pwTitle = this.i18n("portal.chain.key.input-password");
    } else if (this.state.type.key === "keystore") {
      pwTitle = this.i18n("portal.chain.keystore.input-password");
    } else {
      pwTitle = "";
    }

    return (
      <View
        style={[baseStyles.container, { backgroundColor: colors.walletBg }]}
      >
        <KeyboardAwareScrollView
          innerRef={ref => {
            this._scrollView = ref;
          }}
          scrollEventThrottle={1}
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator
          style={{ flex: 1, paddingBottom: 20 }}
        >
          <Text
            style={{
              color: "#fff",
              paddingTop: 10,
              fontSize: 22,
              fontWeight: "bold",
              paddingHorizontal: 27
            }}
          >
            {this.i18n("wallet.import.import-title")}
          </Text>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => {
              this.dismissKeyboard();
            }}
            style={{ flex: 1 }}
          >
            <Text
              style={{
                color: "#ffe894",
                alignItems: "center",
                fontSize: 12,
                paddingHorizontal: 27,
                paddingTop: 20,
                paddingBottom: 10,
                lineHeight: 16
              }}
            >
              {this.i18n("wallet.import.import-notice")}
            </Text>

            {this.createUI()}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {this.state.importModal ? (
          <ImportModal
            select={this.state.type}
            onDismiss={type => {
              this.setState({ type: type, importModal: false });
            }}
          />
        ) : null}
        {this.state.passwordModal ? (
          <PasswordModal
            title={pwTitle}
            onConfirm={exportPassword => {
              this.importAccount(
                this.state.type.key,
                this.state.key,
                this.state.password,
                exportPassword
              );
            }}
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

export default connect(mapStateToProps, mapDispatchToProps)(Import);
