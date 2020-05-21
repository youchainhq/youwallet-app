/**
 * Created by greason on 2019/4/9.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import BasePureLayout from "../../common/base/purelayout";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableHighlight,
  View,
  Animated,
  Image,
  DeviceEventEmitter
} from "react-native";
import baseStyles from "../../styles/base";
import { device, screen } from "../../common/utils";
import FastImage from "react-native-fast-image";
import EStyleSheet from "react-native-extended-stylesheet";
import { TouchImage, ListItem } from "../../components/vendors";
import QRModal from "../../components/modal/qrModal";
import List from "../../components/vendors/list";
import theme from "../../common/theme";
import configs from "../../common/configs";
import YCProgressHUD from "../../components/common/progress";
import PasswordModal from "../../components/modal/passwordModal";

let colors = theme.colors;

const arrHeight = [282, 258];

const headerTopMargin = device.ifiPhoneX(94, 70);
const headerHeight = device.ifiPhoneX(arrHeight[0], arrHeight[1]);
const backgroundTop = device.ifiPhoneX(
  -335 + arrHeight[0],
  -335 + arrHeight[1]
);

const styles = EStyleSheet.create({
  headerContainer: {
    backgroundColor: colors.walletBg,
    height: headerHeight,
    alignItems: "center"
  },
  headerBg: {
    backgroundColor: colors.walletBg,
    position: "absolute",
    width: screen.width,
    resizeMode: "stretch",
    left: 0,
    top: backgroundTop
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
    marginTop: 12
  }
});

const section = [
  {
    name: "portal.wallet-address",
    screen: "WalletAddress"
  },
  {
    name: "portal.wallet-change-pw",
    screen: "ChangePw"
  },
  {
    name: "portal.my-bill",
    screen: "Transaction"
  },
  {
    name: "portal.chain-explorer",
    screen: "Explorer"
  },
  {
    name: "portal.show-mnemonic",
    screen: "ShowMnemonic"
  },
  {
    name: "portal.export-secret",
    screen: "ExportKey"
  },
  {
    name: "portal.export-keystore",
    screen: "ExportKeystore"
  },
  /* {
    name: "portal.share",
    screen: "Share"
  }*/ {
    name: "portal.help",
    screen: "Introduce"
  }
];

class Portal extends BasePureLayout {
  constructor(props) {
    super(props);

    this.state = {
      qrModal: false,
      passwordModal: false
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  _onItemPress = item => {
    switch (item.screen) {
      case "Explorer":
        this.props.navigation.navigate("Web", {
          title: this.i18n("portal.chain-explorer"),
          disableLocale: true,
          url: configs.url.chainExplorer,
          navigationHidden: false
        });
        break;
      case "Transaction":
        this.props.navigation.navigate(item.screen, {
          address: this.props.state.wallet.currentAddress
        });
        break;
      case "ChangePw":
      case "ExportKey":
      case "ExportKeystore":
      case "Introduce":
        this.props.navigation.navigate(item.screen);
        break;
      case "Share":
        YCProgressHUD.showInfoWithStatus(this.i18n("portal.waiting-for"));
        break;
      case "ShowMnemonic":
        this.setState({ passwordModal: true });
        break;
      default:
        break;
    }
  };

  _onQRCodePress = () => {
    this.setState({ qrModal: true });
  };

  onPasswordSubmit = password => {
    const { wallet } = this.props.state;
    let targetWallet = wallet.list[wallet.currentAddress];
    if (targetWallet) {
      if (password !== targetWallet.password) {
        YCProgressHUD.showErrorWithStatus(
          this.i18n("wallet.pay.password-error")
        );
        return;
      }
    }

    this.setState({
      passwordModal: false
    });
    this.props.navigation.navigate("ShowMnemonic", {
      wallet: targetWallet
    });
  };

  _onScroll = ({ nativeEvent: { contentOffset } }) => {};

  _renderHeader = () => {
    const { wallet } = this.props.state;
    let target = wallet.list[wallet.currentAddress];
    return (
      <View style={styles.headerContainer}>
        <Image
          style={styles.headerBg}
          source={require("../../images/portal/portal_bg.png")}
        />
        <View style={{ marginTop: headerTopMargin }}>
          <FastImage
            style={{
              width: 70,
              height: 70,
              borderRadius: 70 / 2
            }}
            source={target.avatar}
            rounded
          />
        </View>

        <Text style={styles.name}>{target.name || wallet.currentAddress}</Text>
      </View>
    );
  };

  view() {
    const { wallet } = this.props.state;
    return (
      <View style={baseStyles.container}>
        <ScrollView
          style={baseStyles.container}
          onScroll={this._onScroll}
          scrollEventThrottle={10}
        >
          {this._renderHeader()}
          <List
            containerStyle={[
              baseStyles.listContainer,
              {
                marginTop: -35,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                marginBottom: 15,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10
              }
            ]}
          >
            {section.map((item, key) => {
              if (
                item.screen === "ShowMnemonic" &&
                !wallet.list[wallet.currentAddress].mnemonic
              ) {
                return null;
              }
              return key === 0 ? (
                <TouchableHighlight
                  key={key}
                  underlayColor={colors.selected}
                  onPress={this._onQRCodePress}
                  style={{
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}
                >
                  <View
                    style={[
                      baseStyles.listItemWrapper,
                      {
                        height: 70,
                        paddingRight: 0,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }
                    ]}
                  >
                    <Text style={baseStyles.listItemTitleNormal}>
                      {this.i18n(item.name)}
                    </Text>
                    {wallet.currentAddress ? (
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row"
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            baseStyles.listItemText,
                            {
                              fontSize: 15,
                              marginTop: 0
                            }
                          ]}
                        >
                          {`${wallet.currentAddress.substring(
                            0,
                            6
                          )}...${wallet.currentAddress.substring(
                            wallet.currentAddress.length - 12,
                            wallet.currentAddress.length
                          )}`}
                        </Text>
                        <TouchImage
                          style={{
                            paddingLeft: 9,
                            paddingRight: 14,
                            paddingTop: 20,
                            paddingBottom: 20
                          }}
                          imageStyle={{
                            width: 24,
                            height: 24
                          }}
                          source={require("../../images/portal/icon-qrcode-grey.png")}
                        />
                      </View>
                    ) : null}
                  </View>
                </TouchableHighlight>
              ) : (
                <ListItem
                  key={key}
                  wrapperStyle={[
                    baseStyles.listItemWrapper,
                    { height: 70 },
                    key === section.length - 1 ? baseStyles.lastItemStyle : ""
                  ]}
                  title={this.i18n(item.name)}
                  titleStyle={[baseStyles.listItemTitleNormal]}
                  rightIcon={
                    <Image
                      source={require("../../images/icon-arrow-right.png")}
                    />
                  }
                  underlayColor={colors.selected}
                  onPress={() => {
                    this._onItemPress(item);
                  }}
                />
              );
            })}
          </List>
        </ScrollView>
        {this.state.qrModal ? (
          <QRModal
            data={{
              name: wallet.list[wallet.currentAddress].name,
              address: wallet.currentAddress
            }}
            onDismiss={() => {
              this.setState({ qrModal: false });
            }}
          />
        ) : null}

        {this.state.passwordModal ? (
          <PasswordModal
            title={this.i18n("wallet.pay.input-password")}
            onConfirm={password => {
              if (!password) {
                YCProgressHUD.showErrorWithStatus(
                  this.i18n("wallet.pay.input-password")
                );
                return;
              }
              this.dismissKeyboard();
              this.onPasswordSubmit(password);
            }}
            onCancel={() => {
              this.dismissKeyboard();
              this.setState({
                passwordModal: false
              });
            }}
          />
        ) : null}
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Portal);
