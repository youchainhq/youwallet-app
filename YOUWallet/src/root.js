/**
 * Created by greason on 2019/4/11.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "./actions";
import React from "react";
import { Image, StyleSheet, DeviceEventEmitter, StatusBar } from "react-native";

import BasePureLayout from "./common/base/purelayout";
import configs from "./common/configs";
import Wallet from "./layouts/wallet";
import Portal from "./layouts/portal";
import { StackNavigator, TabNavigator, TabBarBottom } from "react-navigation";
import { AppScreens, StartupScreens } from "./layouts/layouts";
import theme from "./common/theme";
import I18n from "./i18n";
import NavigationHelper from "./helpers/navigation";
import SplashScreen from "react-native-splash-screen";

const styles = StyleSheet.create({
  footer: {
    backgroundColor: theme.footer
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: "bold"
  }
});

const WalletStack = StackNavigator(
  {
    Wallet: {
      screen: Wallet,
      navigationOptions: () => ({
        title: I18n.t("tab.wallet"),
        tabBarVisible: true
      })
    },
    ...AppScreens
  },
  {
    navigationOptions: {
      header: null,
      tabBarVisible: false
    },
    onTransitionStart: route => {
      DeviceEventEmitter.emit(configs.event.EVENT_TRANSITION_START, route);
    }
  }
);
const PortalStack = StackNavigator(
  {
    Portal: {
      screen: Portal,
      navigationOptions: () => ({
        title: I18n.t("tab.portal"),
        tabBarVisible: true
      })
    },
    ...AppScreens
  },
  {
    navigationOptions: {
      header: null,
      tabBarVisible: false
    }
  }
);

const AppTabNavigator = TabNavigator(
  {
    Wallet: {
      screen: WalletStack
    },
    Portal: {
      screen: PortalStack
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        NavigationHelper.rootNavigation = navigation;

        let icon;
        switch (routeName) {
          case "Wallet":
            icon = focused
              ? require("./images/tab/icon-tab-wallet-active.png")
              : require("./images/tab/icon-tab-wallet.png");
            break;
          case "Portal":
            icon = focused
              ? require("./images/tab/icon-tab-portal-active.png")
              : require("./images/tab/icon-tab-portal.png");
            break;
        }

        return <Image source={icon} />;
      },
      tabBarOnPress: o => {
        const index = o.scene.index;

        o.jumpToIndex(o.scene.index);
      }
    }),
    tabBarPosition: "bottom",
    tabBarComponent: TabBarBottom,
    tabBarOptions: {
      style: styles.footer,
      labelStyle: styles.footerLabel,
      activeTintColor: "#9206F1",
      inactiveTintColor: "#938e87"
    },
    animationEnabled: false,
    swipeEnabled: false,
    initialRouteName: "Wallet"
  }
);

const StartupNavigator = StackNavigator(StartupScreens, {
  initialRouteName: "Startup",
  navigationOptions: {
    header: null
  },
  onTransitionStart: route => {
    DeviceEventEmitter.emit(configs.event.EVENT_TRANSITION_START, route);
  }
});

class Root extends BasePureLayout {
  constructor(props) {
    super(props);

    this.state = { currentAddress: props.state.wallet.currentAddress };
  }

  componentDidMount() {
    SplashScreen.hide();

    StatusBar.setHidden(false);
    StatusBar.setBarStyle("light-content");

    DeviceEventEmitter.addListener(
      configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
      this.closeListener
    );

    DeviceEventEmitter.addListener(
      configs.event.EVENT_TRANSITION_START,
      route => {
        if (route && route.scene && route.scene.route) {
          if (route.scene.route.routeName === "Startup") {
            const { wallet } = this.props.state;
            this.setState({ currentAddress: wallet.currentAddress });
          }
        }
      }
    );
  }

  closeListener = () => {
    const { wallet } = this.props.state;
    this.setState({ currentAddress: wallet.currentAddress });
  };

  componentWillReceiveProps(props) {
    const { wallet } = props.state;
    if (this.props.state.wallet !== props.state.wallet) {
      if (this.state.currentAddress) {
        this.setState({ currentAddress: wallet.currentAddress });
      }
    }
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      configs.event.EVENT_REFRESH_CURRENT_ADDRESS,
      this.closeListener
    );

    DeviceEventEmitter.removeListener(configs.event.EVENT_TRANSITION_START);
  }

  view() {
    if (this.state.currentAddress) {
      return <AppTabNavigator />;
    } else {
      return <StartupNavigator />;
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

export default connect(mapStateToProps, mapDispatchToProps)(Root);
