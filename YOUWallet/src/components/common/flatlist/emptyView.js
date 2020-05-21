import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import theme from "../../../common/theme";
import { screen } from "../../../common/utils";

/**
 * Created by kv.h on 2018/2/27.
 */

const styles = StyleSheet.create({
  containerStyle: {
    // marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    height: screen.height / 3 * 2
  },
  textStyle: {
    alignSelf: "center",
    color: theme.colors.back.placeholderTextColor
  }
});

class EmptyView extends PureComponent {
  static defaultProps = {
    hint: "",
    containerStyle: styles.containerStyle,
    textStyle: styles.textStyle
  };

  render() {
    return (
      <View style={[this.props.containerStyle, this.props.style]}>
        <Text style={this.props.textStyle}>{this.props.hint}</Text>
      </View>
    );
  }
}

export default EmptyView;
