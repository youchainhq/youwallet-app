/**
 * Created by greason on 2019/11/18.
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
  Image,
  Clipboard
} from "react-native";
import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import EStyleSheet from "react-native-extended-stylesheet";
import YCProgressHUD from "../../components/common/progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import configs from "../../common/configs";
import { device, screen } from "../../common/utils";
import _ from "lodash";

let colors = theme.colors;
const styles = EStyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  itemText: {
    fontSize: 15,
    color: "#3b3833",
    paddingBottom: 20
  }
});

class MnemonicCreate extends BasePureLayout {
  constructor(props) {
    super(props);

    const { wallet } = props.navigation.state.params;
    this.state = {
      wallet: wallet
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

  create = () => {
    let data = this.state.wallet.mnemonic.split(" ");
    this.props.navigation.navigate("MnemonicConfirm", {
      wallet: this.state.wallet,
      shuffle: _.shuffle(data)
    });
  };

  renderItem = items => {
    let data = items.split(" ");
    let index = 0;
    let range = 3;
    return (
      <TouchableOpacity
        style={{
          width: screen.width - 20 * 2,
          paddingTop: device.iOS ? 90 : 40,
          paddingLeft: 50,
          paddingBottom: 20
        }}
        activeOpacity={0.8}
        onPress={() => {
          Clipboard.setString(this.state.wallet.mnemonic);
          YCProgressHUD.showSuccessWithStatus(
            this.i18n("wallet.create.mnemonic-copy")
          );
        }}
      >
        <View style={[styles.itemContainer]}>
          {data.slice(index, index + range).map((item, key) => {
            return (
              <View
                style={{
                  flex: 1
                }}
                key={key}
              >
                <Text style={[styles.itemText]}>{item}</Text>
              </View>
            );
          })}
        </View>
        <View style={[styles.itemContainer]}>
          {data.slice(index + range, index + range * 2).map((item, key) => {
            return (
              <View
                style={{
                  flex: 1
                }}
                key={key}
              >
                <Text style={[styles.itemText]}>{item}</Text>
              </View>
            );
          })}
        </View>
        <View style={[styles.itemContainer]}>
          {data.slice(index + range * 2, index + range * 3).map((item, key) => {
            return (
              <View
                style={{
                  flex: 1
                }}
                key={key}
              >
                <Text style={[styles.itemText]}>{item}</Text>
              </View>
            );
          })}
        </View>
        <View style={[styles.itemContainer]}>
          {data.slice(index + range * 3).map((item, key) => {
            return (
              <View
                style={{
                  flex: 1
                }}
                key={key}
              >
                <Text style={[styles.itemText]}>{item}</Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  createUI = () => {
    return (
      <ImageBackground
        source={require("../../images/wallet/create/mnemonic_create_bg.png")}
        style={{
          width: screen.width,
          height: screen.width * 828 / 762,
          marginTop: -4,
          paddingTop: 16,
          alignSelf: "center",
          alignItems: "center"
        }}
        resizeMode={"contain"}
      >
        {this.renderItem(this.state.wallet.mnemonic)}
        <TouchableOpacity
          style={{
            position: "absolute",
            left: (screen.width - 68) / 2,
            bottom: device.android ? 54 : 50,
            flexDirection: "row",
            alignSelf: "center",
            width: 68,
            height: 68,
            borderRadius: 68 / 2,
            backgroundColor: "rgba(146,6,241,1.0)",
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
            {this.i18n("wallet.create.mnemonic")}
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
                lineHeight: 16
              }}
            >
              {this.i18n("wallet.create.mnemonic-notice")}
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

export default connect(mapStateToProps, mapDispatchToProps)(MnemonicCreate);
