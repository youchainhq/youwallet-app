/**
 * Created by greason on 2019/4/16.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Platform,
  Linking,
  AsyncStorage
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";

import BasePureLayout from "../../common/base/purelayout";
import { TouchText, TouchImage } from "../../components/vendors";
import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import { device, screen } from "../../common/utils";
import moment from "moment/moment";
import _ from "lodash";
import YOUChainUtils from "../../common/youchainUtils";
import configs from "../../common/configs";

const colors = theme.colors.back;

const styles = EStyleSheet.create({
  titleWrapper: {
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: "center"
  },
  detailWrapper: {
    borderTopColor: colors.listItemBorder,
    ...Platform.select({
      ios: {
        borderTopWidth: 0.5
      },
      android: {
        borderTopWidth: 1.0
      }
    }),
    borderBottomWidth: 0
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 9,
    marginBottom: 9
  },
  tTitle: {
    fontWeight: "normal"
  },
  tNum: {
    fontSize: 30,
    marginTop: 16,
    marginBottom: 16
  },
  dTitle: {
    fontSize: 14,
    color: colors.listTitle,
    opacity: 0.8
  },
  dContent: {
    fontSize: 14,
    color: colors.listTitle
  },
  linesContent: {
    textAlign: "right",
    maxWidth: device.ifiPhone4(180, 200)
  }
});

export class TransactionDetail extends BasePureLayout {
  constructor(props) {
    super(props);

    this.state = {
      transactionState: this.i18n("portal.chain.transaction.detail.sending")
    };
  }

  navigationOptions() {
    return {
      title: "portal.chain.transaction.detail.title",
      left: true,
      noBorder: true,
      noBg: true,
      containerStyle: { backgroundColor: theme.colors.walletBg },
      goBack: () => {
        this.onGoBack();
      }
    };
  }

  async componentDidMount() {
    const { data } = this.props.navigation.state.params;
    let receipt = await YOUChainUtils.newInstance()
      .getTransactionReceipt(data.txHash)
      .catch(err => {
        console.log("getTransactionReceipt err ", err);
      });
    if (receipt) {
      this.setState({
        transactionState: this.i18n("portal.chain.transaction.detail.success")
      });
    }
  }

  _onTxHash = async () => {
    const { data } = this.props.navigation.state.params;
    if (!_.isEmpty(data.txHash)) {
      let url = "http://test-explorer.iyouchain.com/";

      device.iOS
        ? this.props.navigation.navigate("Web", {
            title: this.i18n("portal.chain.transaction.detail.title"),
            disableLocale: true,
            url: `${url}transaction/detail/${data.txHash}`
          })
        : Linking.openURL(`${url}transaction/detail/${data.txHash}`);
    }
  };

  view() {
    const {
      data: { fromAddress, toAddress, amount, timeStamp, txHash, unit }
    } = this.props.navigation.state.params;
    const { payTitle, symbol } =
      toAddress && toAddress.toLowerCase() === fromAddress.toLowerCase()
        ? {
            payTitle: this.i18n("portal.chain.transaction.detail.received"),
            symbol: "+"
          }
        : {
            payTitle: this.i18n("portal.chain.transaction.detail.pay"),
            symbol: "-"
          };
    return (
      <ScrollView style={baseStyles.container}>
        <View style={[baseStyles.listContainer, baseStyles.pageSpace]}>
          <View style={styles.titleWrapper}>
            <Text style={[baseStyles.listItemTitle, styles.tTitle]}>
              {payTitle}
            </Text>
            <Text style={[baseStyles.listItemTitle, styles.tNum]}>
              {`${symbol}${amount}`}
              {unit && <Text style={{ fontSize: 16 }}>{" " + unit}</Text>}
            </Text>
            <Text style={[{ fontSize: 14, color: colors.statusDefault }]}>
              {this.state.transactionState}
            </Text>
          </View>
          <View style={[baseStyles.listItemWrapper, styles.detailWrapper]}>
            <View style={[styles.detailContainer]}>
              <Text style={[styles.dTitle]}>
                {this.i18n("portal.chain.transaction.detail.from")}
              </Text>
              <Text
                selectable={true}
                numberOfLines={2}
                style={[styles.dContent, styles.linesContent]}
              >
                {fromAddress}
              </Text>
            </View>

            <View style={[styles.detailContainer]}>
              <Text style={[styles.dTitle]}>
                {this.i18n("portal.chain.transaction.detail.to")}
              </Text>
              <Text
                selectable={true}
                numberOfLines={2}
                style={[styles.dContent, styles.linesContent]}
              >
                {toAddress}
              </Text>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.dTitle}>
                {this.i18n("portal.chain.transaction.detail.txHash")}
              </Text>
              <TouchText
                selectable={true}
                title={txHash}
                numberOfLines={3}
                containerStyle={{ flex: 1 }}
                textStyle={[
                  styles.dContent,
                  baseStyles.link,
                  { marginLeft: 30, alignSelf: "flex-end" }
                ]}
                onPress={this._onTxHash}
              />
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.dTitle}>
                {this.i18n("portal.chain.transaction.detail.time")}
              </Text>
              <Text style={styles.dContent}>
                {timeStamp && moment(timeStamp).format("YYYY-MM-DD HH:mm:ss")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetail);
