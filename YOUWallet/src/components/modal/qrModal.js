/**
 * create by yushen on 2018/9/6
 */

import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Clipboard,
  CameraRoll,
  Animated,
  Modal
} from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import _ from "lodash";

import baseStyles from "../../styles/base";
import { Button } from "../../components/vendors";
import { screen, device } from "../../common/utils";
import theme from "../../common/theme";
import YCProgressHUD from "../common/progress";
import TouchImage from "../vendors/image";
import BasePureComponent from "../../common/base/purecomponent";

const colors = theme.colors.back;

const styles = EStyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#e8e8e8",
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5
      },
      android: {
        borderBottomWidth: 1.0
      }
    }),
    height: 44,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  modalTitle: {
    fontSize: 13,
    color: "#3b3833",
    flex: 1,
    textAlign: "center"
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
    ...device.ifiPhoneX({ paddingBottom: 48 }, { paddingBottom: 24 })
  },
  nickName: {
    fontSize: 15,
    color: "#3b3833",
    fontWeight: "bold"
  },
  addressWrapper: {
    flexDirection: "row",
    width: screen.width - 58
  },
  address: {
    color: "#9D9B99",
    fontSize: 13,
    paddingTop: 10,
    paddingBottom: 26
  },
  copyImage: {
    height: 14,
    width: 14,
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 11,
    paddingBottom: 26
  },
  qrContainer: {
    alignSelf: "center",
    marginTop: 14,
    marginBottom: 40
  },
  button: {
    backgroundColor: "#9206F1",
    width: screen.width - 70
  }
});

export default class QRModal extends BasePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      y: new Animated.Value(300)
    };
  }

  componentDidMount() {
    Animated.spring(this.state.y, {
      toValue: 10
    }).start();
  }

  _onCopyPress = address => {
    Clipboard.setString(address);
    YCProgressHUD.showSuccessWithStatus(this.i18n("common.copy-successful"));
  };

  _saveQrPhoto() {
    this._viewShot.capture().then(uri => {
      const failed = () => {
        YCProgressHUD.showErrorWithStatus(this.i18n("common.save-failed"));
      };
      const successful = () => {
        YCProgressHUD.showSuccessWithStatus(
          this.i18n("common.save-successful")
        );
      };
      try {
        CameraRoll.saveToCameraRoll(uri)
          .then(successful)
          .catch(failed);
      } catch (e) {
        failed();
      }
    });
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

  view() {
    const { data: { name, address } } = this.props;
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
                <Text style={styles.modalTitle}>
                  {this.i18n("portal.wallet-address")}
                </Text>
              </View>
              <ViewShot
                options={{ format: "jpg", quality: 0.6 }}
                ref={o => {
                  this._viewShot = o;
                }}
                style={styles.modalBody}
              >
                <Text style={styles.nickName}>{name}</Text>
                <View style={styles.addressWrapper}>
                  <Text style={styles.address}>{address}</Text>
                  <TouchImage
                    style={styles.copyImage}
                    source={require("../../images/portal/icon-copy.png")}
                    onPress={() => this._onCopyPress(address)}
                  />
                </View>
                <View style={styles.qrContainer}>
                  <QRCode
                    value={address}
                    size={172}
                    backgroundColor="white"
                    color="black"
                  />
                </View>
                <Button
                  buttonStyle={[baseStyles.button, styles.button]}
                  title={this.i18n("common.save-photo")}
                  fontSize={15}
                  onPress={() => {
                    this._saveQrPhoto();
                  }}
                />
              </ViewShot>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
