/**
 * Created by greason on 2019/4/12.
 */

import { AppRegistry, YellowBox } from "react-native";
import "./shim";

YellowBox.ignoreWarnings([
  "Warning: componentWillMount is deprecated",
  "Warning: componentWillUpdate is deprecated",
  "Warning: isMounted",
  "Warning: componentWillReceiveProps is deprecated",
  "Warning: Can't call setState",
  "Module RCTImageLoader requires",
  "RCTBridge required",
  "Required dispatch",
  "Class RCTCxxModule was not exported",
  "Remote debugger"
]);

import App from "./App";

AppRegistry.registerComponent("YouChainWallet", () => App, false);
