/**
 * author:       minzhu
 * createTime:   2018/8/17 2:19 PM
 * description:
 */

import React from "react";
import { DeviceEventEmitter, Modal } from "react-native";

import BasePureComponent from "../../common/base/purecomponent";
import configs from "../../common/configs";
import NavigationHelper from "../../helpers/navigation";

export default class ModalCompileVerify extends BasePureComponent {
  constructor(props) {
    super(props);

    this.addListenerToVerifyModalShowEvent();
  }

  addListenerToVerifyModalShowEvent() {
    this.modalShowListen = DeviceEventEmitter.addListener(
      configs.event.EVENT_SHOW_VERIFY_MODAL,
      show => {
        this.setState({ showVerifyModal: show });
      }
    );
  }

  componentWillUnmount() {
    this.modalShowListen.remove();
  }

  view() {
    if (
      (this.state && this.state.showVerifyModal) ||
      NavigationHelper.isShowingVerifyModal
    ) {
      return null;
    }
    return <Modal {...this.props} />;
  }
}
