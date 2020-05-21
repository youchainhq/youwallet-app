/**
 * Created by greason on 2019/4/9.
 */

import React from "react";
import { View, Text, Image } from "react-native";

import BasePureLayout from "../common/base/purelayout";
import TouchOpacity from "../components/vendors/text/touchOpacity";
import baseStyles from "../styles/base";
import theme from "../common/theme";
import LinearGradient from "react-native-linear-gradient";
import { device, screen } from "../common/utils";

let colors = theme.colors;
class Startup extends BasePureLayout {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  view() {
    return (
      <View
        style={[
          baseStyles.container,
          {
            alignItems: "center",
            paddingTop: 142,
            paddingBottom: 32
          }
        ]}
      >
        <LinearGradient
          colors={["rgb(190,1,220)", "rgb(75,3,217)"]}
          style={{
            position: "absolute",
            width: screen.width,
            height: screen.height + 80,
            left: 0,
            top: 0
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Image
          source={require("../images/logo.png")}
          style={{ width: 98, height: 122, marginTop: device.ifiPhoneX(34, 0) }}
        />
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 18, color: "#ffffff", fontWeight: "bold" }}>
          {this.i18n("startup.welcome")}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#ffffff",
            paddingTop: 18,
            paddingHorizontal: 37
          }}
        >
          {this.i18n("startup.introduce-title")}
        </Text>
        <TouchOpacity
          title={this.i18n("startup.create-wallet")}
          containerStyle={{
            flexDirection: "row",
            width: 311,
            height: 50,
            borderRadius: 6,
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 28
          }}
          textStyle={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: colors.walletBg
          }}
          onPress={() => {
            this.props.navigation.navigate("WalletCreate", {});
          }}
        />
        <TouchOpacity
          title={this.i18n("startup.import-wallet")}
          containerStyle={{
            flexDirection: "row",
            width: 311,
            height: 50,
            borderRadius: 6,
            borderWidth: device.android ? 1 : 0.5,
            borderColor: "#ffffff",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14
          }}
          textStyle={{
            flex: 1,
            textAlign: "center",
            fontSize: 16,
            fontWeight: "bold",
            color: "#ffffff"
          }}
          onPress={() => {
            this.props.navigation.navigate("WalletImport", {});
          }}
        />
      </View>
    );
  }
}

export default Startup;
