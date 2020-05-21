/**
 * Created by stephen@ihuanqu.com on 21/02/2018.
 */

import React from "react";
import { Linking, Platform, StatusBar } from "react-native";
import ViewShot from "react-native-view-shot";

import MyWebView from "../components/app/web";
import { device, screen } from "../common/utils";

import BasePureLayout from "../common/base/purelayout";
import theme from "../common/theme";

let colors = theme.colors;
class Web extends BasePureLayout {
  constructor(props) {
    super(props);

    this.state = {
      pinModal: false,
      title: null
    };

    this._patchPostMessageJsCode = `(${String(() => {
      const originalPostMessage = window.postMessage;
      const patchedPostMessage = (message, targetOrigin, transfer) => {
        originalPostMessage(message, targetOrigin, transfer);
      };
      patchedPostMessage.toString = () => {
        return String(Object.hasOwnProperty).replace(
          "hasOwnProperty",
          "postMessage"
        );
      };
      window.postMessage = patchedPostMessage;
      window.postMessage(
        JSON.stringify({
          type: "document_info",
          data: { title: document.title }
        })
      );
    })})();`;

    this.onWebViewMessage = this.onWebViewMessage.bind(this);

    device.iOS && StatusBar.setBarStyle("light-content");
  }

  navigationOptions(navigation) {
    const { params } = navigation.state;
    if (params.navigationHidden) return null;

    return {
      title: this.state.title || params.title || " ",
      left: true,
      disableLocale: (this.state.title && true) || params.disableLocale,
      right: false,
      noBg: true,
      noBorder: true,
      containerStyle: { backgroundColor: colors.walletBg }
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    const { params } = this.props.navigation.state;
    if (device.iOS && params && params.from === "portal") {
      StatusBar.setBarStyle("light-content");
    }
  }

  onWebViewMessage({ nativeEvent: { data } }) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.log(e.message);
      return;
    }

    if (data.type === "document_info") {
      this.setState({
        title: data.data.title
      });
      return;
    }

    if (data.type === "go_back") {
      this.props.navigation.goBack();
      return;
    }

    if (data.type === "go_url") {
      const { target, url } = data.data;
      if (target === "_blank") {
        Linking.openURL(url);
        return;
      }

      this.props.navigation.navigate("Web", data.data);
      return;
    }

    if (data.type === "navigate") {
      const { screen, params } = data.data;
      this.props.navigation.navigate(screen, params);
      return;
    }
  }

  postMessage(message) {
    this._web.webView.injectJavaScript(`__rn_callback('${message}')`);
  }

  view() {
    const {
      url,
      html,
      disableLoading,
      bounces,
      injectedJavaScript = true, //控制 js 注入
      onMessageEnable = true, //控制 onMessage
      allowMediaAutoPlay //video 自动播放
    } = this.props.navigation.state.params;

    return (
      <ViewShot
        options={{ format: "jpg", quality: 0.6 }}
        style={{ flex: 1 }}
        ref={o => {
          this._viewShot = o;
        }}
      >
        <MyWebView
          ref={o => {
            this._web = o;
          }}
          url={url}
          html={html}
          startInLoadingState={!disableLoading}
          injectedJavaScript={
            injectedJavaScript ? this._patchPostMessageJsCode : null
          }
          onMessage={this.onWebViewMessage}
          onMessageEnable={onMessageEnable}
          bounces={!!bounces}
          mediaPlaybackRequiresUserAction={
            allowMediaAutoPlay === undefined
              ? !!device.iOS
              : !allowMediaAutoPlay
          }
        />
      </ViewShot>
    );
  }
}

export default Web;
