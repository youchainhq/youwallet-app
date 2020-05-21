/**
 * Created by stephen@ihuanqu.com on 11/02/2018.
 */

import _ from "lodash";
import I18n from "react-native-i18n";

import en from "./locales/en";
import zh_hans from "./locales/zh_hans";
import zh_hant from "./locales/zh_hant";

I18n.fallbacks = true;

I18n.translations = {
  en: zh_hans
};

I18n.supports = [
  { keys: ["zh-Hans", "zh-CN", "en"], value: "简体中文", id: "zh-hans" }
];

I18n.findLocale = current => {
  const locale = _.find(I18n.supports, value => {
    if (current && _.indexOf(value.keys, current) > -1) {
      return true;
    }
    return (
      _.findIndex(value.keys, key => {
        return I18n.locale.indexOf(key) > -1;
      }) > -1
    );
  });
  return locale || I18n.supports[0];
};

export default I18n;
