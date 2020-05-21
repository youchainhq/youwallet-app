/**
 * Created by greason on 2019/4/24.
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
import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import configs from "../../common/configs";
import TouchImage from "../../components/vendors/image/touchImage";
import QRModal from "../../components/modal/qrModal";
import { device, screen } from "../../common/utils";

let colors = theme.colors;
let contentWidth = 273;

class CreateSuccess extends BasePureLayout {
  constructor(props) {
    super(props);

    const { wallet } = props.navigation.state.params;
    this.state = {
      wallet: wallet,
      qrModal: false
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener(
      configs.event.EVENT_TRANSITION_START,
      this.transitionListener
    );
  }

  transitionListener = route => {
    if (route && route.scene && route.scene.route) {
      if (route.scene.route.routeName === "WalletCreate") {
        DeviceEventEmitter.emit(
          configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
          {}
        );
      }
    }
  };

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      configs.event.EVENT_TRANSITION_START,
      this.transitionListener
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
        navigation.pop(2);
        DeviceEventEmitter.emit(
          configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
          {}
        );
      }
    };
  }

  createUI = () => {
    return (
      <ImageBackground
        source={require("../../images/wallet/create/wallet_create_bg_succ.png")}
        style={{
          width: screen.width,
          minHeight: 491,
          marginTop: -4,
          paddingTop: 16,
          alignSelf: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={require("../../images/wallet/create/icon_create_succ.png")}
          style={{
            width: 148,
            height: 56,
            marginTop: 45
          }}
        />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#3b3833",
            paddingTop: 22
          }}
        >
          {this.i18n("wallet.create.create-success")}
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: contentWidth,
            marginTop: 50,
            paddingLeft: 10
          }}
        >
          <Text style={{ fontSize: 14, color: "#757370" }}>
            {this.i18n("wallet.create.wallet-name")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#3b3833",
              paddingLeft: 10
            }}
          >
            {this.state.wallet.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: contentWidth,
            marginTop: 13,
            paddingLeft: 10,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 14, color: "#757370" }}>
            {this.i18n("wallet.create.wallet-address")}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
              color: "#3b3833",
              paddingLeft: 10
            }}
          >
            {`${this.state.wallet.address.substring(
              0,
              6
            )}...${this.state.wallet.address.substring(
              this.state.wallet.address.length - 12,
              this.state.wallet.address.length
            )}`}
          </Text>
          <TouchImage
            style={{
              paddingLeft: 12,
              paddingRight: 12
            }}
            imageStyle={{
              width: 14,
              height: 14
            }}
            onPress={() => {
              this.setState({ qrModal: true });
            }}
            source={require("../../images/wallet/create/icon-qrcode.png")}
          />
        </View>

        <View
          style={{
            position: "absolute",
            left: (381 - 310) / 2,
            bottom: 192,
            width: 308,
            height: 0.5,
            borderWidth: 0.5,
            borderColor: "#e2e2e2",
            borderStyle: "dashed"
          }}
        />

        <TouchOpacity
          title={this.i18n("wallet.create.wallet-backup")}
          containerStyle={{
            flexDirection: "row",
            width: 257,
            height: 50,
            borderRadius: 7,
            backgroundColor: colors.walletBg,
            alignItems: "center",
            justifyContent: "center",
            marginTop: device.android ? 60 : 70
          }}
          textStyle={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: "#ffffff"
          }}
          onPress={() => {
            this.props.navigation.navigate("ExportKey", {});
          }}
        />
        <TouchOpacity
          title={this.i18n("wallet.create.wallet-enter")}
          containerStyle={{
            flexDirection: "row",
            width: 257,
            height: 50,
            borderRadius: 7,
            borderWidth: 1,
            borderColor: colors.walletBg,
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14
          }}
          textStyle={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: colors.walletBg
          }}
          onPress={() => {
            this.props.navigation.pop(2);
            /*DeviceEventEmitter.emit(
              configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
              {}
            );*/
          }}
        />
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
            {this.i18n("wallet.create.create-success")}
          </Text>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => {
              this.dismissKeyboard();
            }}
            style={{ flex: 1 }}
          >
            {
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
            }
            {this.createUI()}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {this.state.qrModal ? (
          <QRModal
            data={{
              name: this.state.wallet.name,
              address: this.state.wallet.address
            }}
            onDismiss={() => {
              this.setState({ qrModal: false });
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateSuccess);
