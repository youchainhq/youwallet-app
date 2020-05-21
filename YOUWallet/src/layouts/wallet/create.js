/**
 * Created by greason on 2019/4/12.
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import BasePureLayout from "../../common/base/purelayout";
import {
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  ImageBackground,
  Image
} from "react-native";
import TouchOpacity from "../../components/vendors/text/touchOpacity";
import FormInputAdapt from "../../components/vendors/form/formInputAdapt";
import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import EStyleSheet from "react-native-extended-stylesheet";
import YCProgressHUD from "../../components/common/progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import configs from "../../common/configs";
import { device, screen } from "../../common/utils";
import * as Utils from "../../common/utils";
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

class Create extends BasePureLayout {
  constructor(props) {
    super(props);

    this.state = {
      walletName: "",
      walletPs: "",
      walletNotice: "",
      serviceAgree: false,
      wallet: {}
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener(
      configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
      this.closeListener
    );
  }

  closeListener = () => {
    this.props.navigation.pop();
  };

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
      this.closeListener
    );
  }

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

  canSubmit = () => {
    if (!this.state.serviceAgree) {
      return false;
    } else if (!this.state.walletName || !this.state.walletPs) {
      return false;
    }
    return true;
  };

  create = () => {
    if (!this.state.serviceAgree) {
      YCProgressHUD.showInfoWithStatus(
        this.i18n("wallet.create.service-agree-notice")
      );
      return;
    } else if (!this.state.walletName || !this.state.walletPs) {
      return;
    } else if (!Utils.regulars.chain.keyPassword.test(this.state.walletPs)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }

    const { wallet, from } = this.props.navigation.state.params;
    if (from === "Import" && wallet && wallet.address) {
      let newWallet = {
        name: this.state.walletName,
        password: this.state.walletPs,
        notice: this.state.walletNotice,
        avatar: Utils.getRandomAvatar(),
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic
      };

      this.props.actions.createWallet({ wallet: newWallet });
      YCProgressHUD.showSuccessWithStatus(
        this.i18n("wallet.import.import-successful")
      );
      let currentLength = Object.keys(this.props.state.wallet.list).length;
      if (currentLength > 0) {
        this.props.navigation.pop(2);
      } else {
        DeviceEventEmitter.emit(
          configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
          {}
        );
      }

      return;
    }

    let mnemonic = BipUtils.generateMnemonic();
    this.props.navigation.navigate("MnemonicCreate", {
      wallet: {
        name: this.state.walletName,
        password: this.state.walletPs,
        notice: this.state.walletNotice,
        address: "",
        privateKey: "",
        avatar: Utils.getRandomAvatar(),
        mnemonic: mnemonic
      }
    });
  };

  createUI = () => {
    return (
      <ImageBackground
        source={require("../../images/wallet/create/wallet_create_bg.png")}
        style={{
          marginTop: -4,
          paddingTop: 16,
          width: screen.width,
          minHeight: 491,
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
          {this.i18n("wallet.create.wallet-name")}
        </Text>
        <FormInputAdapt
          containerStyle={[baseStyles.inputContainer, styles.inputContainer]}
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
              walletName: value
            });
          }}
          value={this.state.walletName}
          returnKeyType={"next"}
        />
        <Text style={[styles.placeholderStyle]}>
          {this.i18n("wallet.create.wallet-ps")}
        </Text>
        <FormInputAdapt
          containerStyle={[baseStyles.inputContainer, styles.inputContainer]}
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
              walletPs: value
            });
          }}
          value={this.state.walletPs}
          returnKeyType={"next"}
          secureTextEntry={true}
          maxLength={20}
          placeholder={this.i18n("portal.chain.key.placeholder-key")}
          placeholderStyle={{ paddingLeft: 10, color: "#9D9B99", fontSize: 15 }}
        />
        <Text style={[styles.placeholderStyle]}>
          {this.i18n("wallet.create.wallet-ps-notice")}
        </Text>
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
              walletNotice: value
            });
          }}
          value={this.state.walletNotice}
          returnKeyType={"next"}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: contentWidth,
            height: 22
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => {
              this.setState({
                serviceAgree: !this.state.serviceAgree
              });
            }}
            activeOpacity={1.0}
          >
            <Image
              source={
                this.state.serviceAgree
                  ? require("../../images/wallet/create/checked.png")
                  : require("../../images/wallet/create/unchecked.png")
              }
              style={{ width: 22, height: 22 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#999794"
              }}
            >
              {this.i18n("wallet.create.service-agree")}
            </Text>
          </TouchableOpacity>
          <TouchOpacity
            title={this.i18n("startup.introduce")}
            containerStyle={{
              flexDirection: "row",
              justifyContent: "center"
            }}
            textStyle={{
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 12,
              color: "#999794",
              textDecorationLine: "underline",
              textDecorationStyle: "solid"
            }}
            onPress={() => {
              this.props.navigation.navigate("Introduce", {});
            }}
          />
        </View>
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
            marginTop: 10,
            shadowColor: "rgba(181, 6, 241, 0.42)",
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.8
          }}
          activeOpacity={0.8}
          onPress={() => {
            this.create();
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
            {this.i18n("wallet.create.create-title")}
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
              {this.i18n("wallet.create.create-notice")}
            </Text>
            {this.createUI()}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(Create);
