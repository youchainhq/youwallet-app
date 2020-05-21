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
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderColor: "#d8d7d6",
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
  modalTitle: {
    fontSize: 16,
    color: "#3b3833",
    flex: 1,
    textAlign: "center"
  },
  modalBody: {
    width: screen.width,
    paddingBottom: 10,
    backgroundColor: "#fff",
    marginBottom: device.ifiPhoneX(34, 0)
  }
});

export default class ImportModal extends BasePureComponent {
  constructor(props) {
    super(props);

    this.state = {
      y: new Animated.Value(300),
      select: props.select || 0,
      dataSource: this.i18n("wallet.import.types")
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
        onDismiss(this.state.select);
      }, 180);
    }
  };

  _renderItem = ({ item, index, separators }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({ select: item }, () => {
            this._onDismiss();
          });
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
          <Text
            style={[
              {
                flex: 1,
                fontSize: 16,
                color: "#3b3833",
                paddingLeft: 12,
                fontWeight: "bold"
              },
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
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  baseStyles.modalContainer,
                  { transform: [{ translateY: this.state.y }] }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {this.i18n("wallet.import.import-type")}
                  </Text>
                </View>
                <FlatList
                  ref={ref => {
                    this.flatList = ref;
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
