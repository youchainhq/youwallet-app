/**
 * Created by greason on 2019/4/18.
 */

import { Animated, Text, View } from "react-native";
import BasePureComponent from "../../common/base/purecomponent";
import _ from "lodash";
import React from "react";
import baseStyles from "../../styles/base";
import FormInputAdapt from "../vendors/form/formInputAdapt";
import TouchOpacity from "../vendors/text/touchOpacity";
import theme from "../../common/theme";
import { device } from "../../common/utils";
import Modal from "./modal";

const TR_WIDTH = 270,
  TR_HEIGHT = 145;

let colors = theme.colors.back;
export default class PasswordModal extends BasePureComponent {
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
    const { onCancel } = this.props;
    Animated.spring(this.state.opacity, {
      toValue: 0
    }).start();
    if (onCancel) {
      _.delay(() => {
        onCancel();
      }, 180);
    }
  };

  view() {
    let title = this.props.title || this.i18n("common.input-title");
    let placeholder = this.props.placeholder || this.i18n("common.input-title");

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
                alignItems: "center",
                opacity: this.state.opacity,
                backgroundColor: device.android
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(255, 255, 255, 0.8)",
                borderRadius: 12
              }
            ]}
          >
            <Text
              style={{
                fontSize: 17,
                color: "#030303",
                fontWeight: "bold",
                paddingTop: 24
              }}
            >
              {title}
            </Text>
            <FormInputAdapt
              containerStyle={[
                baseStyles.inputContainer,
                {
                  flex: 0,
                  width: TR_WIDTH - 14 * 2,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                  marginLeft: 14,
                  borderColor: "#f5f5f5",
                  borderWidth: 1,
                  borderRadius: 3,
                  backgroundColor: "#f5f5f5"
                },
                { marginHorizontal: 17, marginBottom: 12 }
              ]}
              inputStyle={[
                baseStyles.inputStyle,
                {
                  paddingLeft: 10,
                  textAlign: "left",
                  fontWeight: "bold"
                }
              ]}
              selectionColor={colors.selectionColor}
              onChangeText={value => {
                this.setState({
                  password: value
                });
              }}
              value={this.state.password}
              secureTextEntry={true}
              maxLength={20}
              placeholder={placeholder}
              placeholderStyle={{ paddingLeft: 10 }}
              autoFocus
            />
            <View style={{ flex: 1 }} />
            <View
              style={{
                flexDirection: "row",
                height: 43,
                borderTopWidth: 1,
                borderTopColor: "#d8d7d6"
              }}
            >
              <TouchOpacity
                title={this.i18n("common.cancel")}
                containerStyle={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRightWidth: 1,
                  borderRightColor: "#d8d7d6"
                }}
                textStyle={{
                  flex: 1,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: 17,
                  color: "#007aff"
                }}
                onPress={() => {
                  this.props.onCancel && this.props.onCancel();
                }}
              />
              <TouchOpacity
                title={this.i18n("common.confirm")}
                containerStyle={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                textStyle={{
                  flex: 1,
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: 17,
                  color: "#007aff"
                }}
                onPress={() => {
                  this.props.onConfirm &&
                    this.props.onConfirm(this.state.password);
                }}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
