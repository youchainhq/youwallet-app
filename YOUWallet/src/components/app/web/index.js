/**
 * Created by sean@ihuanqu.com on 2018/6/6.
 */

import React from "react";
import { WebView } from "react-native";
import BasePureComponent from "../../../common/base/purecomponent";

export default class MyWebView extends BasePureComponent {
  constructor(props) {
    super(props);
  }

  view() {
    const {
      url,
      html,
      startInLoadingState,
      injectedJavaScript,
      userAgent,
      onMessage,
      onMessageEnable,
      bounces,
      mediaPlaybackRequiresUserAction
    } = this.props;

    return (
      <WebView
        ref={o => {
          this.webView = o;
        }}
        source={
          url
            ? { uri: url }
            : {
                html: `<!doctype html>
                        <html><head><meta charset="utf-8">
                        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no">
                        <body>
                        <div>${html}</div>
                        </body>
                        </html>`,
                baseUrl: "" //android 部分机型出现中文乱码，解决乱码
              }
        }
        startInLoadingState={startInLoadingState}
        injectedJavaScript={injectedJavaScript}
        userAgent={userAgent}
        onMessage={
          onMessageEnable
            ? e => {
                onMessage && onMessage(e);
              }
            : null
        }
        bounces={bounces}
        mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
      />
    );
  }
}
