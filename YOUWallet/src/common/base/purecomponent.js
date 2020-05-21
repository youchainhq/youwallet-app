/**
 * Created by greason on 2019/4/9.
 */

import { PureComponent } from "react";

import I18n from "../../i18n";
import GlobalManager from "../manager/global";

export default class BasePureComponent extends PureComponent {
  constructor() {
    super();
    this.manager = GlobalManager.sharedInstance();
  }

  i18n(key, params) {
    return I18n.t(key, params);
  }

  view() {
    return null;
  }

  render() {
    return this.view();
  }
}
