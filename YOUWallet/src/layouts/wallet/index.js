/**
 * Created by greason on 2019/4/9.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import BasePureLayout from "../../common/base/purelayout";
import React from "react";
import {
  RefreshControl,
  Text,
  View,
  Animated,
  Platform,
  TouchableOpacity,
  Image
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import baseStyles from "../../styles/base";
import Nav from "../../components/common/nav";
import TouchImage from "../../components/vendors/image";
import Button from "../../components/vendors/button";
import { device, screen, regulars } from "../../common/utils";
import HTMLView from "react-native-htmlview";
import EStyleSheet from "react-native-extended-stylesheet";
import QRModal from "../../components/modal/qrModal";
import List from "../../components/vendors/list";
import ListItem from "../../components/vendors/list/item";
import FormInputAdapt, {
  INPUT_MODE
} from "../../components/vendors/form/formInputAdapt";
import _ from "lodash";
import theme from "../../common/theme";
import YCProgressHUD from "../../components/common/progress";
import * as Utils from "../../common/utils";
import WalletModal from "../../components/modal/walletModal";
import TransactionModal from "../../components/modal/transactionModal";
import YOUChainUtils from "../../common/youchainUtils";
import PasswordModal from "../../components/modal/passwordModal";
import * as youchainUtils from "youchain-utils";
import configs from "../../common/configs";
import SingleChooseModal from "../../components/modal/singleChoose";
import SelfRpcModel from "../../components/modal/selfRpcModel";

let colors = theme.colors;

const headerTopMargin = device.ifiPhoneX(121, 97);
const headerHeight = device.ifiPhoneX(240, 216);
const backgroundTop = device.ifiPhoneX(
  -screen.height * 1.5 + 240,
  -screen.height * 1.5 + 216
);

const styles = EStyleSheet.create({
  headerBg: {
    backgroundColor: colors.walletBg,
    position: "absolute",
    width: screen.width,
    height: screen.height * 1.5,
    left: 0,
    top: backgroundTop
  },
  headerContainer: {
    height: headerHeight,
    width: screen.width,
    alignItems: "center"
  },
  p: {
    marginTop: headerTopMargin,
    paddingHorizontal: 15
  },
  a: {
    fontSize: 28,
    color: "#ffffff",
    fontFamily: "DINAlternate-Bold"
  },
  b: {
    fontSize: 22,
    color: "#ffffff",
    fontFamily: "DINAlternate-Bold"
  },
  amountDesc: {
    marginTop: 15,
    fontSize: 12,
    color: "#D39BF9"
  },
  info: {
    position: "absolute",
    height: 100,
    justifyContent: "center",
    top: headerHeight - 50,
    backgroundColor: "#ffffff",
    width: screen.width - 28,
    marginRight: 14,
    marginLeft: 14,
    paddingLeft: 26,
    paddingRight: 26,
    borderRadius: 15,
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: {
      width: 0,
      height: 7
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10
  },
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  copyContainer: {
    flexDirection: "row"
  },
  copyImage: {
    alignSelf: "center",
    height: 12,
    width: 12
  },
  copyText: {
    color: colors.walletBg,
    fontSize: 12,
    marginLeft: 6
  },
  transactionAddress: {
    color: "#9D9B99",
    fontSize: 14,
    marginTop: 14
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 14,
    paddingRight: 14
  },
  itemHeaderText: {
    paddingTop: 14,
    paddingBottom: 14,
    fontSize: 12
  },
  titleSubtitleContainer: {
    flex: 0,
    width: 92
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  youBrowser: {
    marginTop: 43,
    fontSize: 12,
    color: colors.walletBg,
    alignSelf: "center",
    textDecorationLine: "underline"
  },
  useTips: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 28,
    marginBottom: 10,
    fontSize: 12,
    color: "#9D9B99",
    lineHeight: 18
  },
  nodeChange: {
    marginTop: 10,
    fontSize: 12,
    color: colors.walletBg,
    alignSelf: "center",
    textDecorationLine: "underline",
    marginBottom: 24
  }
});

class Wallet extends BasePureLayout {
  constructor(props) {
    super(props);

    this.provider = configs.youChainProvider;
    this.networkContent = this.i18n("wallet.network.content");

    const { wallet } = props.state;
    let networkType = wallet.networkType || configs.youChainProvider.main.type;
    let network = _.find(this.networkContent, (item, index) => {
      return item.key === networkType;
    });
    if (networkType === configs.youChainProvider.selfRpc.type) {
      if (wallet.selfRpc && wallet.selfRpc.httpHosts.length > 0) {
        YOUChainUtils.newInstance().updateProvider(wallet.selfRpc);
      } else {
        networkType = configs.youChainProvider.main.type;
        network = _.find(this.networkContent, (item, index) => {
          return item.key === networkType;
        });
        YOUChainUtils.newInstance().updateProvider(this.provider[network.key]);
      }
    } else {
      YOUChainUtils.newInstance().updateProvider(this.provider[network.key]);
    }
    this.state = {
      network: network,
      networkModal: false,
      opacity: new Animated.Value(0),
      balance: "0",
      amount: "",
      refreshing: false,
      qrModal: false,
      walletModal: false,
      transactionModal: false,
      passwordModal: false,
      currentAddress: wallet.currentAddress,
      transactionAddress: "",
      estimateGas: 0,
      selfRpc: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { wallet } = nextProps.state;
    if (this.props.state.wallet !== nextProps.state.wallet) {
      this.setState({ currentAddress: wallet.currentAddress }, () => {
        if (nextProps.state.wallet.currentAddress) {
          this.getWalletBalance(nextProps.state.wallet.currentAddress);
        }
      });
    }
  }

  componentDidMount() {
    const { wallet } = this.props.state;
    let targetWallet = wallet.list[wallet.currentAddress];
    YOUChainUtils.newInstance().findAccount(targetWallet.privateKey, () => {
      this.getWalletBalance(wallet.currentAddress);
    });
  }

  componentWillUnmount() {}

  getWalletBalance = async address => {
    if (address) {
      let balance = await YOUChainUtils.newInstance()
        .getBalance(address)
        .catch(err => {
          console.log("getWalletBalance", address, "err", err);
        });
      if (balance) {
        this.setState({
          balance: Utils.fromLu(youchainUtils.hexToNumberString(balance), "you")
        });
      }
    } else {
      this.setState({ balance: "0" });
    }
  };

  _onQRCodePress = () => {
    this.dismissKeyboard();
    this.setState({ qrModal: true });
  };

  _renderNavigation = () => {
    const { wallet } = this.props.state;
    return (
      <Animated.View
        style={{
          position: "absolute"
        }}
      >
        <Nav
          navigationOptions={{
            title: "",
            disableLocale: true,
            titleComponent: (
              <TouchableOpacity
                style={{
                  flex: 1,
                  height: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onPress={() => {
                  this.dismissKeyboard();
                  this.setState({ walletModal: true });
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    minWidth: 20,
                    color: "#ffffff",
                    paddingRight: 5
                  }}
                >
                  {this.state.currentAddress
                    ? wallet.list[this.state.currentAddress].name ||
                      this.state.currentAddress
                    : ""}
                </Text>
                <Image
                  source={require("../../images/wallet/icon_change_account.png")}
                />
              </TouchableOpacity>
            ),
            left: true,
            leftComponent: (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: 96,
                  height: 30,
                  borderRadius: 17,
                  borderWidth: device.iOS ? 0.5 : 1,
                  borderColor: "#fff",
                  marginLeft: 14,
                  paddingHorizontal: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
                activeOpacity={0.9}
                onPress={() => {
                  this.setState({ networkModal: true });
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 8,
                    backgroundColor: "rgb(252,100,89)"
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    color: "#fff",
                    fontSize: 12,
                    paddingLeft: 8
                  }}
                  numberOfLines={1}
                >
                  {this.state.network.key ===
                    configs.youChainProvider.selfRpc.type && wallet.selfRpc
                    ? wallet.selfRpc.chain + "-"
                    : ""}
                  {this.state.network.value}
                </Text>
                <Image
                  source={require("../../images/wallet/icon_change_network.png")}
                />
              </TouchableOpacity>
            ),
            right: true,
            rightComponent: (
              <View
                style={[
                  baseStyles.navRight,
                  { flexDirection: "row", justifyContent: "flex-end" }
                ]}
              >
                <TouchImage
                  style={{ height: 24, width: 24 }}
                  source={require("../../images/wallet/icon-qrcode.png")}
                  onPress={this._onQRCodePress}
                />
              </View>
            ),
            noBorder: true,
            bgComponent: (
              <Animated.View
                style={[baseStyles.nav, { opacity: this.state.opacity }]}
              />
            ),
            containerStyle: {
              backgroundColor: "transparent"
            }
          }}
        />
      </Animated.View>
    );
  };

  _renderHeader = () => {
    let array = Utils.splitIntAndFloat(this.state.balance);
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerBg} />
        <HTMLView
          value={this.i18n("wallet.balance", {
            first: array[0],
            second: array[1]
          })}
          stylesheet={styles}
        />
        <Text style={styles.amountDesc}>
          {this.i18n("wallet.my-amount", {
            unit: this.provider.unit
          })}
        </Text>
      </View>
    );
  };

  _onScroll = ({ nativeEvent: { contentOffset } }) => {
    let newOpacity = 1;
    const fixedHeight = device.android ? 44 : device.ifiPhoneX(88, 64);
    const gap = headerTopMargin - fixedHeight;
    if (contentOffset.y > gap) {
      newOpacity = 1;
    } else if (contentOffset.y >= 0) {
      newOpacity = contentOffset.y / gap;
    } else {
      newOpacity = 0;
    }
    this.state.opacity.setValue(newOpacity);
  };

  _onShowQRScanner = () => {
    this.dismissKeyboard();
    this.props.navigation.navigate("QRScanner", {
      readDataFromQRScanner: (data, navigation) => {
        if (data && regulars.url.test(data)) {
          navigation.replace("Web", {
            title: "scanner.result",
            url: data
          });
          return true;
        } else if (data && youchainUtils.isAddress(data)) {
          this.setState({
            transactionAddress: data
          });
          navigation.goBack();
        } else {
          return false;
        }
      }
    });
  };

  _onAddressInputChange = value => {
    this.setState({
      transactionAddress: value.trim()
    });
  };

  _onAmountInputChange = value => {
    if (value === ".") {
      this.setState({
        amount: "0."
      });
    } else {
      if (!_.isEmpty(value) && !regulars.chain.amount.test(value)) {
        return false;
      }
      this.setState({
        amount: value
      });
    }
  };

  _validate = () => {
    return (
      this.state.balance !== "0" &&
      this.state.amount &&
      this.state.transactionAddress
    );
  };

  _onSubmit = async () => {
    if (!this._validate()) {
      return;
    }

    if (!youchainUtils.isAddress(this.state.transactionAddress)) {
      YCProgressHUD.showErrorWithStatus(this.i18n("wallet.address-error"));
      return;
    }
    this.dismissKeyboard();
    this.setState({ passwordModal: true });
  };

  onPasswordSubmit = async password => {
    const { wallet } = this.props.state;
    let targetWallet = wallet.list[this.state.currentAddress];
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

    let gasPrice = await YOUChainUtils.newInstance()
      .getGasPrice()
      .catch(err => {
        console.log("getGasPrice", "err", err);
      });
    if (gasPrice) {
      gasPrice = youchainUtils.toHex(gasPrice);
    } else {
      gasPrice = youchainUtils.toHex(configs.ycGasPrice);
    }

    let tx = {
      from: this.state.currentAddress,
      to: this.state.transactionAddress,
      gasPrice: gasPrice,
      value: youchainUtils.toHex(Utils.toLu(this.state.amount, "you")),
      data: "0x"
    };
    let estimateGas = await YOUChainUtils.newInstance()
      .getEstimateGas(tx)
      .catch(err => {
        console.log("sendRawTransaction", "err", err);
      });
    if (!estimateGas) {
      tx.gas = configs.ycGas;
    } else {
      tx.gas = youchainUtils.hexToNumber(estimateGas) + 35000; // 额外加 35000 gas
    }
    this.setState({
      passwordModal: false,
      transactionModal: true,
      estimateGas: tx.gas
    });
    tx.gas = youchainUtils.numberToHex(tx.gas);
    YOUChainUtils.newInstance()
      .sendTransaction(tx, targetWallet.privateKey, (txHash, err) => {
        if (err) {
          this.setState({ transactionModal: false });
          YCProgressHUD.showErrorWithStatus(
            this.i18n("wallet.transaction-error") + err
          );
          return;
        }
        _.delay(() => {
          this.setState({ transactionModal: false, estimateGas: 0 });
          if (txHash) {
            YCProgressHUD.showSuccessWithStatus(
              this.i18n("wallet.transaction-success")
            );
          } else {
            YCProgressHUD.showErrorWithStatus(
              this.i18n("wallet.transaction-error")
            );
          }
        }, 1000);
        if (txHash) {
          this.props.actions.sendTransaction({
            transaction: {
              fromAddress: this.state.currentAddress,
              toAddress: this.state.transactionAddress,
              gasPrice: gasPrice,
              amount: this.state.amount,
              txHash: txHash,
              timeStamp: new Date().getTime(),
              unit: this.provider.unit
            }
          });
          this.getWalletBalance(this.state.currentAddress);
        }
      })
      .catch(err => {
        console.log("sendRawTransaction error", err);
      });
  };

  _renderItems = () => {
    return (
      <View>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemHeaderText, { color: "#1e1e1e" }]}>
            {this.i18n("wallet.target-address")}
          </Text>
        </View>
        <List containerStyle={[baseStyles.listContainer]}>
          <View
            style={[
              baseStyles.listItemWrapper,
              baseStyles.lastItemStyle,
              {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                maxHeight: device.iOS ? 110 : 100
              }
            ]}
          >
            <FormInputAdapt
              containerStyle={[baseStyles.inputContainer]}
              inputMode={INPUT_MODE.MULTI}
              inputStyle={[
                {
                  minHeight: 20,
                  maxHeight: 40,
                  width: "100%",
                  color: "#3b3833",
                  paddingTop: 0,
                  paddingBottom: 0,
                  fontSize: 15,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
              multiInputStyle={{
                top: 0
              }}
              placeholderContainerStyle={{
                paddingTop: 0,
                height: 20,
                justifyContent: "flex-start"
              }}
              placeholder={this.i18n("wallet.address-input-placeholder")}
              placeholderStyle={{
                left: 0,
                ...Platform.select({
                  android: {
                    top: 8
                  },
                  ios: {
                    top: 2
                  }
                }),
                textAlign: "left",
                fontSize: 15,
                color: "#9D9B99"
              }}
              selectionColor={colors.walletBg}
              value={this.state.transactionAddress}
              onChangeText={this._onAddressInputChange}
              returnKeyType={"next"}
              blurOnSubmit
              numberOfLines={2}
              onFocus={() => {
                device.android && this._scrollView.scrollTo({ y: 120 });
              }}
              onSubmitEditing={() => {
                this._amountInput && this._amountInput.focus();
              }}
            />
            <TouchImage
              style={{ paddingLeft: 12, paddingTop: 10, paddingBottom: 10 }}
              onPress={this._onShowQRScanner}
              source={require("../../images/wallet/icon-scan.png")}
            />
          </View>
        </List>
        <List containerStyle={[baseStyles.listContainer, baseStyles.pageSpace]}>
          <ListItem
            wrapperStyle={[
              baseStyles.listItemWrapper,
              baseStyles.lastItemStyle,
              {
                paddingTop: 15,
                paddingBottom: 15
              }
            ]}
            titleSubtitleContainerStyle={styles.titleSubtitleContainer}
            titleStyle={[baseStyles.listItemTitleNormal, { fontSize: 15 }]}
            title={this.i18n("wallet.amount")}
            rightComponent={
              <View style={styles.rightContainer}>
                <FormInputAdapt
                  ref={ref => (this._amountInput = ref)}
                  containerStyle={[baseStyles.inputContainer]}
                  inputStyle={[
                    baseStyles.inputStyle,
                    {
                      textAlign: "right",
                      fontSize: 15,
                      fontFamily: "DINAlternate-Bold"
                    }
                  ]}
                  placeholder={this.i18n("wallet.amount-input-placeholder")}
                  placeholderStyle={[
                    {
                      right: 0,
                      textAlign: "right",
                      fontSize: 15,
                      color: "#9D9B99",
                      lineHeight: 20,
                      width: "100%",
                      fontFamily: "DINAlternate-Bold"
                    }
                  ]}
                  selectionColor={colors.walletBg}
                  value={this.state.amount}
                  onChangeText={this._onAmountInputChange}
                  keyboardType="numeric"
                  blurOnSubmit
                  onFocus={() => {
                    device.android && this._scrollView.scrollTo({ y: 200 });
                  }}
                  onSubmitEditing={() => {}}
                />
              </View>
            }
          />
        </List>
      </View>
    );
  };

  view() {
    const { wallet } = this.props.state;
    let currentWallet = wallet.list[wallet.currentAddress];

    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          innerRef={ref => {
            this._scrollView = ref;
          }}
          scrollEventThrottle={1}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.getWalletBalance(this.state.currentAddress);
              }}
            />
          }
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator
          style={[baseStyles.container]}
          onScroll={this._onScroll}
        >
          {this._renderHeader()}
          {this._renderItems()}
          <Button
            buttonStyle={[
              baseStyles.button,
              {
                marginTop: 14,
                backgroundColor: colors.walletBg
              }
            ]}
            title={this.i18n("common.confirm")}
            fontSize={15}
            onPress={this._onSubmit}
            disabled={!this._validate()}
            disabledStyle={{ backgroundColor: colors.walletBg }}
          />
          <Text style={styles.useTips}>{this.i18n("wallet.use-tips")}</Text>
        </KeyboardAwareScrollView>
        {this._renderNavigation()}
        {this.state.qrModal ? (
          <QRModal
            data={{
              name: currentWallet.name,
              address: wallet.currentAddress
            }}
            onDismiss={() => {
              this.setState({ qrModal: false });
            }}
          />
        ) : null}
        {this.state.walletModal ? (
          <WalletModal
            data={wallet}
            navigation={this.props.navigation}
            onDismiss={() => {
              this.setState({ walletModal: false });
            }}
            onChange={address => {
              if (address === this.state.currentAddress) {
                return;
              }
              this.setState(
                {
                  walletModal: false,
                  balance: "0",
                  transactionAddress: "",
                  amount: ""
                },
                () => {
                  this.props.actions.updateCurrentWallet({
                    currentAddress: address
                  });
                  const { wallet } = this.props.state;
                  let targetWallet = wallet.list[address];
                  YOUChainUtils.newInstance().findAccount(
                    targetWallet.privateKey,
                    (address, privateKey) => {
                      this.getWalletBalance(address);
                    }
                  );
                }
              );
            }}
            onDelete={address => {
              this.props.actions.deleteWallet({
                address: address
              });
            }}
          />
        ) : null}
        {this.state.transactionModal ? (
          <TransactionModal
            estimateGas={this.state.estimateGas}
            onDismiss={() => {
              this.setState({ transactionModal: false, estimateGas: 0 });
            }}
          />
        ) : null}
        {this.state.passwordModal ? (
          <PasswordModal
            title={this.i18n("wallet.pay.input-password")}
            placeholder={currentWallet.notice}
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

        {this.state.networkModal ? (
          <SingleChooseModal
            title={this.i18n("wallet.network.choose")}
            keyName={"key"}
            valueName={"value"}
            datas={this.networkContent}
            selfRpc={wallet.selfRpc}
            select={this.state.network}
            onChoose={network => {
              if (network.key === this.state.network.key) {
                this.setState({ networkModal: false });
                return;
              }
              if (network.key === configs.youChainProvider.selfRpc.type) {
                // 自定义
                this.setState({ networkModal: false }, () => {
                  // this.setState({ selfRpc: network });

                  this.props.navigation.navigate("DefineRpc", {
                    network: network,
                    provider: wallet.selfRpc,
                    callback: (name, url) => {
                      let selfNet = {
                        chain: name,
                        httpHosts: [url],
                        wsHosts: []
                      };
                      this.setState({ network: network, balance: "0" }, () => {
                        this.props.actions.updateCurrentNetwork({
                          networkType: network.key,
                          selfRpc: selfNet
                        });
                        YOUChainUtils.newInstance().updateProvider(selfNet);
                        this.getWalletBalance(this.state.currentAddress);
                      });
                    }
                  });
                });
                return;
              }
              this.setState(
                { networkModal: false, network: network, balance: "0" },
                () => {
                  this.props.actions.updateCurrentNetwork({
                    networkType: network.key
                  });
                  YOUChainUtils.newInstance().updateProvider(
                    this.provider[network.key]
                  );
                  this.getWalletBalance(this.state.currentAddress);
                }
              );
            }}
            onDismiss={() => {
              this.setState({ networkModal: false });
            }}
          />
        ) : null}

        {this.state.selfRpc ? (
          <SelfRpcModel
            title={this.i18n("wallet.network.selfRpc.title")}
            content={wallet.selfRpc && wallet.selfRpc.httpHosts[0]}
            onConfirm={rpc => {
              this.dismissKeyboard();
              let network = this.state.selfRpc;
              let selfNet = {
                chain: "youchain",
                httpHosts: [rpc],
                wsHosts: []
              };
              this.setState(
                { selfRpc: null, network: network, balance: "0" },
                () => {
                  this.props.actions.updateCurrentNetwork({
                    networkType: network.key,
                    selfRpc: selfNet
                  });
                  YOUChainUtils.newInstance().updateProvider(selfNet);
                  this.getWalletBalance(this.state.currentAddress);
                }
              );
            }}
            onCancel={() => {
              this.dismissKeyboard();
              this.setState({
                selfRpc: false
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

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
