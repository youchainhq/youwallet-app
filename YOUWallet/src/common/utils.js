/**
 * Created by stephen@ihuanqu.com on 20/02/2018.
 */

import { Dimensions, PixelRatio, Platform } from "react-native";
import configs from "./configs";
import _ from "lodash";
import YOUChainUtils from "./youchainUtils";

export const regulars = {
  ...configs.regulars
};

export const screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,
  pixelRatio: PixelRatio.get()
};

export const device = {
  iOS: Platform.OS === "ios",
  android: Platform.OS === "android",
  iPhoneX: () => {
    return (
      device.iOS &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (screen.height >= 812 || screen.width >= 812)
    );
  },
  ifiPhoneX: (iPhoneXStyle, regularStyle) => {
    return device.iPhoneX() ? iPhoneXStyle : regularStyle;
  },
  iPhone4: () => {
    return (
      device.iOS &&
      !Platform.isTVOS &&
      (screen.height === 320 || screen.width === 320)
    );
  },
  ifiPhone4: (iPhone4Style, regularStyle) => {
    return device.iPhone4() ? iPhone4Style : regularStyle;
  }
};

export function encryptData(key, password) {
  if (!key) {
    return "";
  }
  return XXTEA.encryptToBase64(key, password);
}

export function decryptData(key, password) {
  if (!key) {
    return "";
  }
  return XXTEA.decryptFromBase64(key, password);
}

export function paramsToString(...params) {
  return JSON.stringify(params);
}

const AVATAR_SOURCE = [
  require("../images/portal/avatar/avatar_1.png"),
  require("../images/portal/avatar/avatar_2.png"),
  require("../images/portal/avatar/avatar_3.png"),
  require("../images/portal/avatar/avatar_4.png"),
  require("../images/portal/avatar/avatar_5.png"),
  require("../images/portal/avatar/avatar_6.png"),
  require("../images/portal/avatar/avatar_7.png"),
  require("../images/portal/avatar/avatar_8.png"),
  require("../images/portal/avatar/avatar_9.png"),
  require("../images/portal/avatar/avatar_10.png"),
  require("../images/portal/avatar/avatar_11.png"),
  require("../images/portal/avatar/avatar_12.png"),
  require("../images/portal/avatar/avatar_13.png"),
  require("../images/portal/avatar/avatar_14.png"),
  require("../images/portal/avatar/avatar_15.png"),
  require("../images/portal/avatar/avatar_16.png")
];

export function getRandomAvatar() {
  let index = Math.floor(Math.random() * AVATAR_SOURCE.length);

  return AVATAR_SOURCE[index];
}

export function splitIntAndFloat(data) {
  if (!data) {
    return ["0", ""];
  }
  let array = data.split(".");
  if (array.length === 1 || !array[1]) {
    return [array[0], ""];
  }
  return [array[0], "." + array[1]];
}

export function randomPick(list) {
  return list[_.random(0, list.length - 1)];
}

export function getHttpHost(provider) {
  return randomPick(provider.httpHosts);
}

export function getWsHost(provider) {
  return randomPick(provider.wsHosts);
}

export function fromLu(result, unit = "you") {
  return YOUChainUtils.newInstance().youchainUtils.fromLu(
    YOUChainUtils.newInstance().youchainUtils.hexToNumberString(result),
    unit
  );
}

export function toLu(result, unit = "you") {
  return YOUChainUtils.newInstance().youchainUtils.toLu(result, unit);
}
