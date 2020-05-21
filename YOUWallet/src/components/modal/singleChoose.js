/**
 * Created by greason on 2019/11/13.
 */

import React from "react";
import {
  View,
  Text,
  Platform,
  Animated,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import _ from "lodash";

import baseStyles from "../../styles/base";
import theme from "../../common/theme";
import BasePureComponent from "../../common/base/purecomponent";
import EmptyView from "../common/flatlist/emptyView";
import { device, screen } from "../../common/utils";
import configs from "../../common/configs";
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

/**
 * keyName : 关键字，唯一标识
 */
export default class SingleChooseModal extends BasePureComponent {
  constructor(props) {
    super(props);

    this.heightY = 60 + props.datas.length * 60 + device.ifiPhoneX(34, 0);
    this.state = {
      y: new Animated.Value(300),
      dataSource: props.datas || [],
      select: props.select,
      keyName: props.keyName,
      valueName: props.valueName
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
      toValue: this.heightY
    }).start();
    if (onDismiss) {
      _.delay(() => {
        onDismiss();
      }, 180);
    }
  };

  _renderItem = ({ item, index, separators }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ select: item });
          Animated.spring(this.state.y, {
            toValue: this.heightY
          }).start();
          _.delay(() => {
            this.props.onChoose && this.props.onChoose(item);
          }, 180);
        }}
        activeOpacity={0.95}
      >
        <View
          style={{
            flex: 1,
            height: 60,
            marginLeft: 14,
            paddingRight: 14,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth:
              index === this.state.dataSource.length - 1 ? 0 : 0.5,
            borderBottomColor: "#d8d7d6",
            backgroundColor: "#fff"
          }}
        >
          <Text
            style={[
              { flex: 1, fontSize: 15, color: "#62605c" },
              this.state.select[this.state.keyName] ===
                item[this.state.keyName] && {
                color: "#3b3833",
                fontWeight: "bold"
              }
            ]}
          >
            {item[this.state.valueName]}
            {item[this.state.keyName] === configs.youChainProvider.selfRpc.type && this.props.selfRpc
              ? `(${this.props.selfRpc.chain})`
              : ""}
          </Text>
          {this.state.select[this.state.keyName] ===
          item[this.state.keyName] ? (
            <Image
              style={{ width: 18, height: 18 }}
              source={require("../../images/icon-checked.png")}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  view() {
    const { title } = this.props;

    return (
      <Modal
        animationType={"none"}
        transparent
        onRequestClose={this._onDismiss}
      >
        <View style={[baseStyles.modalLayout]}>
          <TouchableOpacity
            onPress={this._onDismiss}
            style={{ flex: 1 }}
            activeOpacity={1}
          />
          <Animated.View
            style={[
              baseStyles.modalContainer,
              {
                transform: [{ translateY: this.state.y }]
              }
            ]}
          >
            <TouchableOpacity style={styles.modalHeader} activeOpacity={1}>
              <Text style={{ fontSize: 15, color: "#383833" }}>{title}</Text>
            </TouchableOpacity>
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
      </Modal>
    );
  }
}
