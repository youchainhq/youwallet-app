/**
 * Created by greason on 2019/4/9.
 */
import React, { PureComponent } from "react";
import { Keyboard, View } from "react-native";

import I18n from "../../i18n";
import GlobalManager from "../../common/manager/global";
import Nav from "../../components/common/nav";

export default class BasePureLayout extends PureComponent {
  constructor() {
    super();
    this.manager = GlobalManager.sharedInstance();
    this.onGoBack = this.onGoBack.bind(this);
  }

  i18n(key, params) {
    return I18n.t(key, params);
  }

  onGoBack() {
    this.dismissKeyboard();
    this.props.navigation.pop();
  }

  navigationOptions() {
    return null;
  }

  dismissKeyboard() {
    Keyboard.dismiss();
  }

  componentWillReceiveProps(props) {}

  view() {
    return null;
  }

  render() {
    const { navigation } = this.props;
    const navigationOptions = this.navigationOptions(navigation);

    return (
      <View style={{ flex: 1 }}>
        {navigationOptions ? (
          <Nav navigation={navigation} navigationOptions={navigationOptions} />
        ) : null}

        {this.view()}
      </View>
    );
  }
}
