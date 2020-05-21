/**
 * Created by greason on 2019/11/18.
 */

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import React from "react";
import BasePureLayout from "../../common/base/purelayout";
import theme from "../../common/theme";
import EStyleSheet from "react-native-extended-stylesheet";
import {
  View,
  Text,
  Clipboard,
  TouchableOpacity,
  StatusBar
} from "react-native";
import YCProgressHUD from "../../components/common/progress";
import { device } from "../../common/utils";
import baseStyles from "../../styles/base";

let colors = theme.colors;
const styles = EStyleSheet.create({
  contentWrapper: {
    marginTop: 24,
    marginHorizontal: 14,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center"
  },
  notice: {
    fontSize: 12,
    color: "#B48E50",
    lineHeight: 14
  },
  centerContainer: {
    marginTop: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F1F1F3",
    backgroundColor: "#F4F4F8"
  },
  mnemonic: {
    fontSize: 16,
    color: "#9aa0ae",
    lineHeight: 22,
    padding: 20
  }
});

class ShowMnemonic extends BasePureLayout {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    device.iOS && StatusBar.setBarStyle("light-content");
  }

  navigationOptions(navigation) {
    return {
      title: "portal.show-mnemonic",
      left: true,
      noBg: true,
      noBorder: true,
      containerStyle: { backgroundColor: colors.walletBg }
    };
  }

  view() {
    const { wallet } = this.props.navigation.state.params;

    return (
      <View
        style={[baseStyles.container, { backgroundColor: colors.walletBg }]}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.notice}>
            {this.i18n("portal.mnemonic.notice")}
          </Text>
          <TouchableOpacity
            style={styles.centerContainer}
            activeOpacity={0.8}
            onPress={() => {
              Clipboard.setString(wallet.mnemonic);
              YCProgressHUD.showSuccessWithStatus(
                this.i18n("wallet.create.mnemonic-copy")
              );
            }}
          >
            <Text style={styles.mnemonic}>{wallet && wallet.mnemonic}</Text>
          </TouchableOpacity>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowMnemonic);
