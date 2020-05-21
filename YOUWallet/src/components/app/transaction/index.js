/**
 * Created by greason on 2019/4/16.
 */

import React from "react";
import { View, Image, TouchableHighlight, Text } from "react-native";
import _ from "lodash";
import EStyleSheet from "react-native-extended-stylesheet";

import theme from "../../../common/theme";
import baseStyles from "../../../styles/base";
import BasePureComponent from "../../../common/base/purecomponent";
import moment from "moment/moment";

const colors = theme.colors.back;
const styles = EStyleSheet.create({
  title: {
    flex: 1,
    color: colors.listTitle,
    fontSize: 14,
    marginRight: 50
  },
  subTitle: {
    fontWeight: "normal",
    color: "#b1afad",
    fontSize: 12,
    marginLeft: 21
  },
  rightTitle: {
    fontWeight: "bold",
    color: colors.listTitle,
    fontSize: 16
  },
  icon: {
    marginRight: 12
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default class TransactionItem extends BasePureComponent {
  constructor(props) {
    super(props);
  }

  _formatDate = date => {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  };

  _renderContent = () => {
    const {
      index,
      data: { fromAddress, toAddress, amount, timeStamp, unit },
      onPress
    } = this.props;
    let { comment, icon, symbol } =
      toAddress && toAddress.toLowerCase() === fromAddress.toLowerCase()
        ? {
            comment: fromAddress,
            icon: require(`../../../images/icon-into.png`),
            symbol: "+"
          }
        : {
            comment: toAddress,
            icon: require(`../../../images/icon-outto.png`),
            symbol: "-"
          };

    return (
      <TouchableHighlight
        onPress={() => {
          onPress && onPress(this.props.data);
        }}
        underlayColor={colors.selected}
      >
        <View
          style={[
            baseStyles.listItemWrapper,
            { marginTop: 0, backgroundColor: "transparent" }
          ]}
        >
          <View style={styles.titleWrapper}>
            <Image source={icon} style={styles.icon} />
            <Text style={styles.title} numberOfLines={1}>
              {comment}
            </Text>
            <Text style={styles.rightTitle}>
              {`${symbol}${amount}`}
              {unit && <Text style={{ fontSize: 12 }}>{" " + unit}</Text>}
            </Text>
          </View>
          <View style={[styles.titleWrapper, { marginTop: 8 }]}>
            <Text style={styles.subTitle}>
              {timeStamp && this._formatDate(timeStamp)}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  view() {
    return (
      <View style={{ backgroundColor: "#fff" }}>{this._renderContent()}</View>
    );
  }
}
