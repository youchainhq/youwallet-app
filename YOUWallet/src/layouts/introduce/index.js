/**
 * Created by greason on 2019/4/12.
 */

import BasePureLayout from "../../common/base/purelayout";
import { View, Text } from "react-native";
import React from "react";
import theme from "../../common/theme";
import baseStyles from "../../styles/base";

const colors = theme.colors;

class Introduce extends BasePureLayout {
  constructor() {
    super();
  }

  componentDidMount() {}

  navigationOptions() {
    return {
      title: "startup.introduce",
      left: true,
      noBorder: true,
      noBg: true,
      containerStyle: { backgroundColor: colors.walletBg },
      goBack: () => {
        this.onGoBack();
      }
    };
  }

  view() {
    return (
      <View style={baseStyles.container}>
        <Text
          style={{
            fontSize: 18,
            color: "#3b3833",
            fontWeight: "bold",
            paddingTop: 19,
            paddingBottom: 21,
            alignSelf: "center"
          }}
        >
          {this.i18n("startup.introduce")}
        </Text>
        <Text style={{ fontSize: 14, color: "#3b3833" }}>
          {this.i18n("startup.introduce-content")}
        </Text>
      </View>
    );
  }
}

export default Introduce;
