import React, { PureComponent } from "react";
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  StyleSheet,
  View,
  Platform,
  ActivityIndicator
} from "react-native";

import Text from "../text";

import theme from "../../../common/theme";

let colors = theme.colors.back;

const stylesObject = {
  container: {
    marginLeft: 15,
    marginRight: 15
  },
  button: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  text: {
    color: colors.white,
    fontSize: 18
  },
  icon: {
    marginRight: 10
  },
  iconRight: {
    marginLeft: 10
  },
  small: {
    padding: 12
  },
  smallFont: {
    fontSize: 14
  },
  activityIndicatorStyle: {
    marginHorizontal: 10,
    height: 0
  },
  raised: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,0,0, .4)",
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1
      },
      android: {
        backgroundColor: "#fff",
        elevation: 2
      }
    })
  }
};

const styles = StyleSheet.create(stylesObject);

class Button extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      disabled,
      loading,
      loadingRight,
      activityIndicatorStyle,
      buttonStyle,
      borderRadius,
      title,
      onPress,
      secondary,
      backgroundColor,
      color,
      fontSize,
      underlayColor,
      raised,
      textStyle,
      small,
      large,
      clear,
      fontWeight,
      disabledStyle,
      disabledTextStyle,
      fontFamily,
      containerViewStyle,
      rounded,
      outline,
      transparent,
      textNumberOfLines,
      textEllipsizeMode,
      allowFontScaling,
      ...attributes
    } = this.props;

    let { ViewComponent } = this.props;

    let loadingElement;
    if (loading) {
      loadingElement = (
        <ActivityIndicator
          animating
          style={[styles.activityIndicatorStyle, activityIndicatorStyle]}
          color={color || "white"}
          size={(large && "large") || "small"}
        />
      );
    }
    if (!ViewComponent && Platform.OS === "ios") {
      ViewComponent = TouchableHighlight;
    }
    if (!ViewComponent && Platform.OS === "android") {
      ViewComponent = TouchableNativeFeedback;
    }
    if (!ViewComponent) {
      ViewComponent = TouchableHighlight;
    }

    if (Platform.OS === "android" && (borderRadius && !attributes.background)) {
      if (Platform.Version >= 21) {
        attributes.background = TouchableNativeFeedback.Ripple(
          "ThemeAttrAndroid",
          true
        );
      } else {
        attributes.background = TouchableNativeFeedback.SelectableBackground();
      }
    }

    const baseFont = {
      color: (textStyle && textStyle.color) || color || stylesObject.text.color,
      size:
        (textStyle && textStyle.fontSize) ||
        fontSize ||
        (small && stylesObject.smallFont.fontSize) ||
        stylesObject.text.fontSize
    };

    let textOptions = {};
    if (textNumberOfLines) {
      textOptions.numberOfLines = textNumberOfLines;
      if (textEllipsizeMode) {
        textOptions.ellipsizeMode = textEllipsizeMode;
      }
    }

    return (
      <View
        style={[
          styles.container,
          raised && styles.raised,
          containerViewStyle,
          borderRadius && { borderRadius }
        ]}
      >
        <ViewComponent
          {...attributes}
          underlayColor={underlayColor || "transparent"}
          onPress={() => onPress()}
          disabled={disabled || false}
        >
          <View
            pointerEvents="box-only"
            style={[
              styles.button,
              secondary && { backgroundColor: colors.secondary },
              backgroundColor && { backgroundColor: backgroundColor },
              borderRadius && { borderRadius },
              small && styles.small,
              rounded && {
                borderRadius: baseFont.size * 3.8,
                paddingHorizontal: small
                  ? stylesObject.small.padding * 1.5
                  : stylesObject.button.padding * 1.5
              },
              outline && {
                borderWidth: 1,
                backgroundColor: "transparent",
                borderColor: baseFont.color
              },
              transparent && {
                borderWidth: 0,
                backgroundColor: "transparent"
              },
              buttonStyle && buttonStyle,
              disabled && !clear && { backgroundColor: colors.disabled },
              disabled && disabledStyle
            ]}
          >
            {loading && !loadingRight && loadingElement}
            <Text
              style={[
                styles.text,
                color && { color },
                small && styles.smallFont,
                fontSize && { fontSize },
                textStyle && textStyle,
                fontWeight && { fontWeight },
                fontFamily && { fontFamily },
                disabled && !clear && { color: colors.disabledText },
                disabled && disabledTextStyle
              ]}
              {...textOptions}
              allowFontScaling={allowFontScaling}
            >
              {title}
            </Text>
            {loading && loadingRight && loadingElement}
          </View>
        </ViewComponent>
      </View>
    );
  }
}

export default Button;
