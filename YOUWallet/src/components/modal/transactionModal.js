/**
 * Created by greason on 2019/4/18.
 */

import { Animated, Easing, Image,   Text, View } from "react-native";
import BasePureComponent from "../../common/base/purecomponent";
import _ from "lodash";
import React from "react";
import baseStyles from "../../styles/base";
import * as Animatable from "react-native-animatable";
import Modal from "./modal"

const TR_WIDTH = 296,
  TR_HEIGHT = 191;

export default class TransactionModal extends BasePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.spring(this.state.opacity, {
      toValue: 1
    }).start();
  }

  componentWillUnmount() {}

  _onDismiss = () => {
    const { onDismiss } = this.props;
    Animated.spring(this.state.opacity, {
      toValue: 0
    }).start();
    if (onDismiss) {
      _.delay(() => {
        onDismiss();
      }, 180);
    }
  };

  view() {
    const { estimateGas } = this.props;

    return (
      <Modal
        animationType={"none"}
        transparent
        onRequestClose={this._onDismiss}
      >
        <View
          style={[
            baseStyles.modalLayout,
            {
              justifyContent: "center",
              alignItems: "center"
            }
          ]}
        >
          <Animated.View
            style={[
              baseStyles.modalContainer,
              {
                width: TR_WIDTH,
                height: TR_HEIGHT,
                justifyContent: "center",
                alignItems: "center",
                opacity: this.state.opacity,
                backgroundColor: "#ffffff",
                shadowColor: "rgba(0, 0, 0, 0.06)",
                shadowOffset: {
                  width: 0,
                  height: 5
                },
                shadowRadius: 20,
                shadowOpacity: 1,
                borderRadius: 12
              }
            ]}
          >
            <Image
              source={require("../../images/wallet/icon_transaction_bg.png")}
              style={{
                position: "absolute",
                width: 187,
                height: 50,
                marginTop: 50,
                marginLeft: 0
              }}
            />
            <Animatable.Image
              animation={"rotate"}
              duration={2500}
              easing={"linear"}
              iterationCount="infinite"
              source={require("../../images/wallet/loading.png")}
              useNativeDriver={true}
            />
            <Text style={{ fontSize: 16, color: "#3b3833", paddingTop: 37 }}>
              {this.i18n("wallet.transaction-sending")}
            </Text>
            {estimateGas ? (
              <Text style={{ fontSize: 12, color: "#3b3833", paddingTop: 10 }}>
                {this.i18n("wallet.transaction-estimateGas", {
                  estimateGas: estimateGas
                })}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
