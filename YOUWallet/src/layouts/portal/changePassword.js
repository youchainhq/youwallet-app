/**
 * Created by greason on 2019/4/16.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import _ from "lodash";
import React from "react";
import { View, Text, ScrollView, Animated, Platform } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import md5 from "blueimp-md5";

import BasePureLayout from "../../common/base/purelayout";
import {
  List,
  ListItem,
  FormInputAdapt,
  Button
} from "../../components/vendors";
import theme from "../../common/theme";
import baseStyles from "../../styles/base";
import YCProgressHUD from "../../components/common/progress";
import { device, screen } from "../../common/utils";
import * as Utils from "../../common/utils";

const colors = theme.colors;
const back = theme.colors.back;

const styles = EStyleSheet.create({
  titleSubtitleContainer: {
    flex: 0,
    width: 120
  },
  rightContainer: {
    flex: 1,
    alignItems: "center"
  },

  input: {
    fontSize: 16
  },
  msgContainer: {
    marginTop: 14,
    marginBottom: 14,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    justifyContent: "flex-start"
  }
});

class ChangePassword extends BasePureLayout {
  constructor(props) {
    super(props);

    this._topHeight = device.ifiPhoneX(94, 70);
    this._contentHeight = 380;
    this._loginBtnBottom = 0;
    this._needScroll = false;
    this.state = {
      code: "",
      password: "",
      confirmPassword: "",
      codeCountdown: 0,
      keyboardHeight: 0,
      scrollViewHeight: new Animated.Value(this._contentHeight)
    };

    this.onPasswordInputChange = this.onPasswordInputChange.bind(this);
    this.onConfirmPasswordInputChange = this.onConfirmPasswordInputChange.bind(
      this
    );
    this.onSubmit = this.onSubmit.bind(this);
  }

  navigationOptions() {
    return {
      title: "portal.chain.changePw.title",
      left: true,
      noBorder: true,
      noBg: true,
      containerStyle: { backgroundColor: colors.walletBg },
      goBack: () => {
        this.onGoBack();
      }
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onFocusPwdInput = () => {
    this._scrollToPosition(50 * 2);
  };

  onFocusConfirmInput = () => {
    this._scrollToPosition(50 * 2);
  };

  _scrollToPosition = yPos => {
    console.log("======scroll to: ", yPos);
  };

  onPasswordInputChange(value) {
    this.setState({
      password: value
    });
  }

  onConfirmPasswordInputChange(value) {
    this.setState({
      confirmPassword: value
    });
  }

  validate() {
    if (!_.isEqual(this.state.password, this.state.confirmPassword)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.changePw.pay-password-not-same")
      );
      return false;
    }
    if (!Utils.regulars.chain.keyPassword.test(this.state.password)) {
      YCProgressHUD.showErrorWithStatus(
        this.i18n("portal.chain.wrong-password")
      );
      return;
    }
    return true;
  }

  onSubmit() {
    if (!this.validate()) return;

    const { wallet } = this.props.state;
    this.props.actions.changePayPassword({
      password: this.state.password,
      address: wallet.currentAddress
    });
    this.props.navigation.pop();
  }

  onRenderContent() {
    return (
      <ScrollView
        ref={c => (this._scrollView = c)}
        style={device.android ? baseStyles.container : { flex: 1 }}
        keyboardShouldPersistTaps={"handled"}
      >
        <List containerStyle={[baseStyles.listContainer, baseStyles.pageSpace]}>
          <ListItem
            wrapperStyle={[
              baseStyles.listItemWrapper,
              baseStyles.listItemHeight
            ]}
            titleSubtitleContainerStyle={styles.titleSubtitleContainer}
            titleStyle={[baseStyles.listItemTitleNormal]}
            title={this.i18n("portal.chain.changePw.pay-password-new")}
            rightComponent={
              <FormInputAdapt
                containerStyle={[
                  styles.rightContainer,
                  baseStyles.inputContainer
                ]}
                inputStyle={[baseStyles.inputStyle]}
                placeholderTextColor={back.placeholderTextColor}
                selectionColor={back.selectionColor}
                onChangeText={this.onPasswordInputChange}
                value={this.state.password}
                maxLength={20}
                secureTextEntry
                onFocus={this.onFocusPwdInput}
              />
            }
          />
          <ListItem
            wrapperStyle={[
              baseStyles.listItemWrapper,
              baseStyles.listItemHeight,
              baseStyles.lastItemStyle
            ]}
            titleSubtitleContainerStyle={styles.titleSubtitleContainer}
            titleStyle={[baseStyles.listItemTitleNormal]}
            title={this.i18n("portal.chain.changePw.password-confirm")}
            rightComponent={
              <FormInputAdapt
                containerStyle={[
                  styles.rightContainer,
                  baseStyles.inputContainer
                ]}
                inputStyle={[baseStyles.inputStyle]}
                placeholderTextColor={back.placeholderTextColor}
                selectionColor={back.selectionColor}
                onChangeText={this.onConfirmPasswordInputChange}
                value={this.state.confirmPassword}
                maxLength={20}
                secureTextEntry
                onFocus={this.onFocusConfirmInput}
              />
            }
          />
        </List>
        <View style={styles.msgContainer}>
          <Text
            style={[
              {
                color: colors.listTitle,
                opacity: 0.6
              }
            ]}
          >
            {this.i18n("portal.chain.wrong-password")}
          </Text>
        </View>
        <Button
          buttonStyle={[
            baseStyles.button,
            {
              marginTop: 0,
              backgroundColor: colors.walletBg
            }
          ]}
          disabledStyle={{ backgroundColor: colors.walletBg }}
          title={this.i18n("common.confirm-edit")}
          fontSize={16}
          onPress={this.onSubmit}
          disabled={
            _.isEmpty(this.state.password) ||
            _.isEmpty(this.state.confirmPassword)
          }
          ref={ref => (this._loginBtn = ref)}
        />
      </ScrollView>
    );
  }

  view() {
    if (device.iOS) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: back.background
          }}
        >
          <Animated.View
            style={{
              ...Platform.select({
                ios: {
                  height:
                    this.state.keyboardHeight > 0
                      ? this.state.scrollViewHeight
                      : screen.height
                }
              })
            }}
          >
            {this.onRenderContent()}
          </Animated.View>
        </View>
      );
    } else {
      return this.onRenderContent();
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
