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
  Image,
  FlatList
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import _ from "lodash";

import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import BasePureComponent from "../../common/base/purecomponent";
import EmptyView from "../common/flatlist/emptyView";
import { device, screen } from "../../common/utils";
import Modal from "./modal"

const colors = theme.colors.back;

const styles = EStyleSheet.create({
  modalHeader: {
    width: screen.width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

export default class NetWorkModal extends BasePureComponent {
  constructor(props) {
    super(props);

    this.state = {
      y: new Animated.Value(300),
      dataSource: props.datas || [],
      select: props.select
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
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (this.state.select !== index) {
            this.setState({ select: index });
            Animated.spring(this.state.y, {
              toValue: 500
            }).start();
            _.delay(() => {
              this.props.onChoose && this.props.onChoose(item);
            }, 180);
          }
        }}
      >
        <View
          style={{
            flex: 1,
            height: 60,
            paddingLeft: 18,
            paddingRight: 14,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 0.5,
            borderBottomColor: "#d8d7d6",
            backgroundColor: "#fff"
          }}
        >
          <Text
            style={[
              { flex: 1, fontSize: 15, color: "#62605c", paddingLeft: 12 },
              this.state.select.key === item.key && {
                color: "#3b3833",
                fontWeight: "bold"
              }
            ]}
          >
            {item.value}
          </Text>
          {this.state.select.key === item.key ? (
            <Image
              style={{ width: 18, height: 18 }}
              source={require("../../images/icon-checked.png")}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  view() {
    return (
      <Modal
        animationType={"none"}
        transparent
        onRequestClose={this._onDismiss}
      >
        <TouchableWithoutFeedback onPress={this._onDismiss}>
          <View style={baseStyles.modalLayout}>
            <Animated.View
              style={[
                baseStyles.modalContainer,
                { transform: [{ translateY: this.state.y }] }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={{ fontSize: 15, color: "#383833" }}>
                  {this.i18n("wallet.network.choose")}
                </Text>
              </View>
              <FlatList
                ref={ref => {
                  this.list = ref;
                }}
                style={[styles.modalBody]}
                data={this.state.dataSource}
                renderItem={this._renderItem}
                windowSize={4}
                keyExtractor={(item, index) => `${index} - ${item}`}
                ListEmptyComponent={() => (
                  <EmptyView hint={this.i18n("placeholder.nodata")} />
                )}
              />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
