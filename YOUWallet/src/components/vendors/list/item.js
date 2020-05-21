import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Platform,
  Image
} from "react-native";

import Text from "../text";

import theme from "../../../common/theme";
import fonts from "../../../common/fonts";

let colors = theme.colors;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent"
  },
  wrapper: {
    flexDirection: "row",
    marginLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    alignItems: "center",
    borderBottomColor: "#e8e8e8",
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5
      },
      android: {
        borderBottomWidth: 1.0
      }
    })
  },
  iconStyle: {
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    marginRight: 8
  },
  title: {
    fontSize: 14,
    color: colors.grey1
  },
  titleRow: {
    flexDirection: "row"
  },
  subtitle: {
    color: colors.grey3,
    fontSize: 12,
    marginTop: 1,
    ...Platform.select({
      ios: {
        fontWeight: "600"
      },
      android: {
        ...fonts.android.bold
      }
    })
  },
  titleSubtitleContainer: {
    justifyContent: "center",
    flex: 1
  },
  chevronContainer: {
    alignItems: "flex-end",
    justifyContent: "center"
  },
  rightTitleContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  rightTitleStyle: {
    marginRight: 0,
    color: colors.grey4
  },
  disabled: {
    opacity: 0.5
  }
});

const defaultProps = {
  underlayColor: "white",
  chevronColor: colors.grey4,
  rightIcon: { name: "chevron-right" },
  hideChevron: false,
  roundAvatar: false,
  titleNumberOfLines: 1,
  subtitleNumberOfLines: 1,
  rightTitleNumberOfLines: 1,
  disabled: false
};

class ListItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onPress,
      title,
      leftIcon,
      rightIcon,
      titleSubtitleContainerStyle,
      underlayColor,
      subtitle,
      subtitleFull,
      subtitleStyle,
      containerStyle,
      wrapperStyle,
      titleNumberOfLines,
      titleStyle,
      titleContainerStyle,
      leftComponent,
      hideChevron,
      component,
      fontFamily,
      rightTitle,
      rightTitleContainerStyle,
      rightTitleStyle,
      rightTitleNumberOfLines,
      rightComponent,
      subtitleContainerStyle,
      subtitleNumberOfLines,
      onLongPress,
      disabled,
      disabledStyle,
      ...attributes
    } = { ...defaultProps, ...this.props };

    let ViewComponent = onPress || onLongPress ? TouchableHighlight : View;
    if (component) {
      ViewComponent = component;
    }

    return (
      <ViewComponent
        {...attributes}
        onLongPress={onLongPress}
        onPress={onPress}
        disabled={disabled}
        underlayColor={underlayColor}
        style={[
          styles.container,
          containerStyle && containerStyle,
          disabled && styles.disabled,
          disabled && disabledStyle && disabledStyle
        ]}
      >
        <View style={[styles.wrapper, wrapperStyle && wrapperStyle]}>
          {React.isValidElement(leftComponent) && leftComponent}

          {!leftComponent && (
            <View
              style={[
                styles.titleSubtitleContainer,
                titleSubtitleContainerStyle && titleSubtitleContainerStyle
              ]}
            >
              <View
                style={[
                  titleContainerStyle,
                  subtitleFull && rightTitle && styles.titleRow
                ]}
              >
                {title !== null &&
                (typeof title === "string" || typeof title === "number") ? (
                  <Text
                    numberOfLines={titleNumberOfLines}
                    style={[
                      styles.title,
                      titleStyle && titleStyle,
                      fontFamily && { fontFamily }
                    ]}
                  >
                    {title}
                  </Text>
                ) : (
                  <View>{title}</View>
                )}
                {subtitleFull &&
                  rightTitle && (
                    <View
                      style={[
                        styles.rightTitleContainer,
                        rightTitleContainerStyle
                      ]}
                    >
                      <Text
                        numberOfLines={rightTitleNumberOfLines}
                        style={[styles.rightTitleStyle, rightTitleStyle]}
                      >
                        {rightTitle}
                      </Text>
                    </View>
                  )}
              </View>
              <View style={subtitleContainerStyle}>
                {subtitle !== null &&
                (typeof subtitle === "string" ||
                  typeof subtitle === "number") ? (
                  <Text
                    numberOfLines={subtitleNumberOfLines}
                    style={[
                      styles.subtitle,
                      !leftIcon && { marginLeft: 10 },
                      subtitleStyle && subtitleStyle,
                      fontFamily && { fontFamily }
                    ]}
                  >
                    {subtitle}
                  </Text>
                ) : (
                  <View>{subtitle}</View>
                )}
              </View>
            </View>
          )}
          {!subtitleFull &&
            !!rightTitle &&
            rightTitle !== "" && (
              <View
                style={[styles.rightTitleContainer, rightTitleContainerStyle]}
              >
                <Text
                  numberOfLines={rightTitleNumberOfLines}
                  style={[styles.rightTitleStyle, rightTitleStyle]}
                >
                  {rightTitle}
                </Text>
              </View>
            )}

          {React.isValidElement(rightComponent) && rightComponent}

          {!hideChevron &&
            (React.isValidElement(rightIcon) ? (
              rightIcon
            ) : rightIcon ? (
              <View disabled={disabled} style={styles.chevronContainer}>
                <Image
                  style={[
                    {
                      width: 34,
                      height: 34
                    },
                    rightIcon.style,
                    rightIcon.rounded && {
                      borderRadius: rightIcon.style.width / 2
                    }
                  ]}
                  source={rightIcon.source}
                />
              </View>
            ) : null)}
        </View>
      </ViewComponent>
    );
  }
}

export default ListItem;
