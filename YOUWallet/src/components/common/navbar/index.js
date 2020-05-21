/**
 * Created by sean@ihuanqu.com on 2018/2/18.
 */

import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import BasePureComponent  from "../../../common/base/purecomponent";
import { Text } from "../../../components/vendors";
import theme from "../../../common/theme";

const colors = theme.colors.back;

const styles = EStyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 45,
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5
      },
      android: {
        borderBottomWidth: 1.0
      }
    }),
    borderBottomColor: colors.listBorder,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1
  },
  titleWrapper: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent"
  },
  titleWrapperActive: {
    borderBottomColor: colors.buttonBg
  },
  title: {
    fontSize: 14,
    color: colors.listTitle,
    opacity: 0.9
  },
  titleActive: {
    color: colors.buttonBg,
    opacity: 1.0
  }
});

export default class Navbar  extends BasePureComponent  {
  constructor(props) {
    super(props);

    this.state = {
      active: 0
    };
    this.onSwitchChannel = this.onSwitchChannel.bind(this);
  }

  componentDidMount() {
    const { data, type } = this.props;
    this.setState({
      active: type === undefined ? data[0].type : type
    });
  }

  onSwitchChannel(value) {
    const { callback } = this.props;

    this.setState({
      active: value
    });

    callback && callback(value);
  }

  view() {
    const { data, containerStyle, textStyle, titleWrapperStyle } = this.props;

    return (
      <View style={[styles.container, containerStyle && containerStyle]}>
        {data.map((item, key) => {
          return (
            <TouchableOpacity
              key={key}
              style={styles.wrapper}
              onPress={() => {
                this.onSwitchChannel(item.type);
              }}
            >
              <View
                style={[
                  styles.titleWrapper,
                  titleWrapperStyle && titleWrapperStyle,
                  this.state.active === item.type && styles.titleWrapperActive
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    textStyle && textStyle,
                    this.state.active === item.type && styles.titleActive
                  ]}
                >
                  {this.i18n(item.title)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}
