/**
 * Created by sean@ihuanqu.com on 2018/2/14.
 */

import React from "react";
import { Platform, View, Image, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import BasePureComponent from "../../../common/base/purecomponent";
import { TouchImage } from "../../../components/vendors";
import theme from "../../../common/theme";
import { screen, device } from "../../../common/utils";

const colors = theme.colors.back;
const distances = theme.distances.back;

const styles = EStyleSheet.create({
  container: {
    backgroundColor: colors.navBackground,
    borderBottomColor: colors.listBorder,
    width: screen.width,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 10,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5,
        ...device.ifiPhoneX({ height: 88 }, { height: 64 })
      },
      android: {
        borderBottomWidth: 1.0
      }
    })
  },
  textStyle: {
    fontSize: 18,
    color: colors.navText,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginBottom: device.iOS ? 2 : 0
  },
  left: {
    paddingLeft: 14,
    width: distances.navLeft,
    alignItems: "flex-start"
  },
  right: {
    paddingRight: 14,
    width: distances.navRight,
    alignItems: "flex-end"
  },
  backgroundImage: {
    resizeMode: "cover",
    position: "absolute",
    width: screen.width,
    left: 0,
    top: 0,
    ...device.ifiPhoneX({ height: 88 })
  }
});

export default class Nav extends BasePureComponent {
  constructor(props) {
    super(props);
  }

  view() {
    let { navigation, navigationOptions } = this.props;
    const {
      title,
      titleComponent,
      disableLocale, // 是否禁止本地化
      containerStyle,
      leftStyle,
      textStyle,
      left,
      leftComponent,
      goBack,
      right,
      rightComponent,
      filter,
      noBorder,
      noBg,
      bgComponent
    } = navigationOptions;

    return (
      <View>
        <View
          style={[
            styles.container,
            containerStyle && containerStyle,
            noBorder && {
              borderBottomWidth: 0
            }
          ]}
        >
          {!noBg &&
            (bgComponent ? (
              bgComponent
            ) : (
              <Image
                source={require("../../../images/bar.png")}
                style={styles.backgroundImage}
              />
            ))}

          {left ? (
            leftComponent ? (
              leftComponent
            ) : (
              <TouchImage
                style={[styles.left, leftStyle && leftStyle]}
                source={require("../../../images/icon-back.png")}
                onPress={() => {
                  goBack ? goBack() : navigation.goBack();
                }}
              />
            )
          ) : (
            <View style={styles.left} />
          )}
          {titleComponent && titleComponent}
          {title ? (
            <Text
              style={[styles.textStyle, textStyle && textStyle]}
              numberOfLines={1}
            >
              {disableLocale ? title : this.i18n(title)}
            </Text>
          ) : null}
          {right ? (
            rightComponent && rightComponent
          ) : (
            <View style={[styles.right]} />
          )}
        </View>
        {filter || null}
      </View>
    );
  }
}
