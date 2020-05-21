/**
 * Created by greason on 2019/4/17.
 */

import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  Image
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import _ from "lodash";

import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import BasePureComponent from "../../common/base/purecomponent";
import TouchOpacity from "../vendors/text/touchOpacity";
import EmptyView from "../common/flatlist/emptyView";
import { device, screen } from "../../common/utils";
import FixSwipeableFlatList from "../common/swipeadFlatList/SwipeadFlatList";
import Modal from "./modal";

const colors = theme.colors.back;

const styles = EStyleSheet.create({
  modalHeader: {
    width: screen.width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderColor: colors.listBorder,
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5
      },
      android: {
        borderBottomWidth: 1.0
      }
    }),
    height: 60,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 14
  },
  modalBody: {
    width: screen.width,
    paddingBottom: 10,
    backgroundColor: "#fff",
    marginBottom: device.ifiPhoneX(34, 0)
  }
});

export default class WalletModal extends BasePureComponent {
  constructor(props) {
    super(props);

    let dataSource = [];
    if (props.data.currentAddress) {
      dataSource.push(props.data.list[props.data.currentAddress]);
      for (let address in props.data.list) {
        if (address !== props.data.currentAddress) {
          dataSource.push(props.data.list[address]);
        }
      }
    }
    this.state = {
      y: new Animated.Value(300),
      dataSource: dataSource,
      select: 0
    };
  }

  componentDidMount() {
    Animated.spring(this.state.y, {
      toValue: 10
    }).start();
  }

  _onDismiss = () => {
    const { onDismiss } = this.props;
    Animated.spring(this.state.y, {
      toValue: 500
    }).start();
    if (onDismiss) {
      _.delay(() => {
        onDismiss();
      }, 180);
    }
  };

  _renderItem = ({ item, index, separators }) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.state.select !== index) {
            this.setState({ select: index });
            Animated.spring(this.state.y, {
              toValue: 500
            }).start();
            _.delay(() => {
              this.props.onChange && this.props.onChange(item.address);
            }, 180);
          }
        }}
      >
        <View
          style={{
            flex: 1,
            height: 60,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderBottomColor: "#d8d7d6",
            backgroundColor: "#fff"
          }}
        >
          <Image style={{ width: 40, height: 40 }} source={item.avatar} />
          <Text
            style={[
              { flex: 1, fontSize: 15, color: "#62605c", paddingLeft: 12 },
              this.state.select === index && {
                color: "#3b3833",
                fontWeight: "bold"
              }
            ]}
          >
            {item.name || item.address}
          </Text>
          {this.state.select === index ? (
            <Image
              style={{ width: 18, height: 18 }}
              source={require("../../images/icon-checked.png")}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _quickActions = ({ index, item }) => {
    if (this.state.select === index && this.state.dataSource.length > 1) {
      return;
    }
    return (
      <TouchOpacity
        title={this.i18n("common.delete")}
        containerStyle={{
          width: 80,
          height: 60,
          backgroundColor: "#ff3a30",
          alignSelf: "flex-end",
          justifyContent: "center"
        }}
        textStyle={{
          textAlign: "center",
          fontSize: 15,
          color: "#ffffff"
        }}
        onPress={() => {
          this.props.onDelete && this.props.onDelete(item.address);

          let dataSource = _.clone(this.state.dataSource);
          delete dataSource[index];
          this.setState({ dataSource: dataSource });
        }}
      />
    );
  };

  view() {
    const { navigation } = this.props;
    return (
      <Modal
        animationType={"none"}
        transparent
        onRequestClose={this._onDismiss}
      >
        <TouchableWithoutFeedback onPress={this._onDismiss}>
          <View style={baseStyles.modalLayout}>
            <TouchableWithoutFeedback style={{ opacity: 0.05 }}>
              <Animated.View
                style={[
                  baseStyles.modalContainer,
                  { transform: [{ translateY: this.state.y }] }
                ]}
              >
                <View style={styles.modalHeader}>
                  <TouchOpacity
                    title={this.i18n("wallet.create.create-title")}
                    containerStyle={{
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    textStyle={{
                      textAlign: "center",
                      fontSize: 15,
                      color: theme.colors.walletBg
                    }}
                    onPress={() => {
                      this._onDismiss();
                      navigation.navigate("WalletCreate", {});
                    }}
                  />
                  <TouchOpacity
                    title={this.i18n("startup.import-wallet")}
                    containerStyle={{
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    textStyle={{
                      textAlign: "center",
                      fontSize: 15,
                      color: theme.colors.walletBg
                    }}
                    onPress={() => {
                      this._onDismiss();
                      navigation.navigate("WalletImport", {});
                    }}
                  />
                </View>
                <FixSwipeableFlatList
                  ref={ref => {
                    this.swipeable = ref;
                  }}
                  style={[styles.modalBody]}
                  data={this.state.dataSource}
                  renderItem={this._renderItem}
                  windowSize={4}
                  keyExtractor={(item, index) => `${index} - ${item}`}
                  ListEmptyComponent={() => (
                    <EmptyView hint={this.i18n("placeholder.nodata")} />
                  )}
                  renderQuickActions={this._quickActions}
                  maxSwipeDistance={80}
                  bounceFirstRowOnMount={false}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
