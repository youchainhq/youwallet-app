/**
 * Created by stephen@ihuanqu.com on 01/03/2018.
 */

import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, Image, Clipboard } from "react-native";
import * as Animatable from "react-native-animatable";
import ImagePicker from "react-native-image-crop-picker";
import QRCodeScanner from "react-native-qrcode-scanner";
import EStyleSheet from "react-native-extended-stylesheet";
import QRCodeLocalImage from "@remobile/react-native-qrcode-local-image";
import BasePureLayout from "../common/base/purelayout";
import { screen } from "../common/utils";
import baseStyles from "../styles/base";
import TouchText from "../components/vendors/text/touch";
import YCProgressHUD from "../components/common/progress";
import theme from "../common/theme";

const styles = EStyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  zeroContainer: {
    height: 0,
    flex: 0
  },
  cameraContainer: {
    height: screen.height
  }
});

class QRScanner extends BasePureLayout {
  constructor(props) {
    super(props);

    this.onTakePhoto = this.onTakePhoto.bind(this);
    this.onScannerRead = this.onScannerRead.bind(this);

    this.state = {
      opacity: 0
    };
  }

  navigationOptions(navigation) {
    return {
      title: "scanner.title",
      noBg: true,
      noBorder: true,
      containerStyle: { backgroundColor: theme.colors.walletBg },
      left: true,
      right: true,
      goBack: () => {
        navigation.goBack();
      },
      rightComponent: (
        <TouchText
          title={this.i18n("common.album")}
          containerStyle={[
            baseStyles.navRight,
            baseStyles.navRightTextContainer
          ]}
          textStyle={[baseStyles.listItemTitleNormal, baseStyles.navRightText]}
          onPress={this.onTakePhoto}
        />
      )
    };
  }

  componentDidMount() {
    _.delay(() => {
      const duration = 3000;
      const loop = () => {
        this._scannerLine &&
          this._scannerLine.transition(
            { translateY: 0 },
            { translateY: 250 },
            duration,
            "linear"
          );
      };

      this.setState({ opacity: 1 });
      loop();
      this._timer = setInterval(loop, duration);
    }, 1000);
  }

  componentWillUnmount() {
    this._timer && clearInterval(this._timer);
    this._timer = null;
  }

  onTakePhoto() {
    ImagePicker.openPicker({
      cropping: false
    })
      .then(image => {
        QRCodeLocalImage.decode(
          image.path.replace("file://", ""),
          (error, result) => {
            this.onScannerRead({ data: result });
          }
        );
      })
      .catch(e => {
        console.log(e.message);
      });
  }

  onScannerRead(event) {
    const { readDataFromQRScanner } = this.props.navigation.state.params;

    if (typeof readDataFromQRScanner === "function") {
      let html = event.data || this.i18n("scanner.error-title");
      const valid = readDataFromQRScanner(event.data, this.props.navigation);
      valid === false &&
        this.props.navigation.replace("Web", {
          title: this.i18n("scanner.result"),
          disableLocale: true,
          shareMenu: false,
          html: html,
          customizeView: (
            <TouchText
              containerStyle={{
                paddingRight: 14,
                width: 94,
                alignItems: "flex-end",
                marginBottom: 2
              }}
              textStyle={{
                fontWeight: "normal",
                color: "#ffffff",
                fontSize: 16
              }}
              title={this.i18n("common.copy")}
              onPress={() => {
                Clipboard.setString(html);
                YCProgressHUD.showSuccessWithStatus(
                  this.i18n("common.copy-content")
                );
              }}
            />
          )
        });
    }
  }

  view() {
    return (
      <View
        style={[
          baseStyles.container,
          {
            backgroundColor: "black"
          },
          styles.container
        ]}
      >
        <QRCodeScanner
          onRead={this.onScannerRead}
          topViewStyle={styles.zeroContainer}
          cameraStyle={styles.cameraContainer}
          bottomViewStyle={styles.zeroContainer}
          ref={o => {
            this.scanner = o;
          }}
        />
        <View style={{ position: "absolute" }}>
          <Image source={require("../images/scanner-box.png")} />
          <Animatable.Image
            ref={o => {
              this._scannerLine = o;
            }}
            useNativeDriver
            source={require("../images/scanner-line.png")}
            style={{
              position: "absolute",
              top: 2,
              opacity: this.state.opacity
            }}
          />
        </View>
      </View>
    );
  }
}

export default QRScanner;
