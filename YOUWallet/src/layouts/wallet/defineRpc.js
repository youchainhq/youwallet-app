/**
 * Created by greason on 2020/5/16.
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import BasePureLayout from "../../common/base/purelayout";
import baseStyles from "../../styles/base";
import { View } from "react-native";
import theme from "../../common/theme";
import FormInputAdapt from "../../components/vendors/form/formInputAdapt";
import TouchOpacity from "../../components/vendors/text/touchOpacity";
import List from "../../components/vendors/list";
import ListItem from "../../components/vendors/list/item";
import EStyleSheet from "react-native-extended-stylesheet";

let colors = theme.colors;
const styles = EStyleSheet.create({
  titleSubtitleContainer: {
    flex: 0,
    width: 100
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  }
});

class DefineRpc extends BasePureLayout {
  constructor(props) {
    super(props);

    let params = props.navigation.state.params;
    let provider = params && params.provider;
    this.state = {
      name: (provider && provider.chain) || "",
      url: (provider && provider.httpHosts[0]) || ""
    };
  }

  navigationOptions(navigation) {
    return {
      title: this.i18n("wallet.network.selfRpc.title"),
      disableLocale: true,
      left: true,
      noBg: true,
      noBorder: true,
      containerStyle: { backgroundColor: colors.walletBg },
      goBack: () => {
        navigation.goBack();
      }
    };
  }

  componentDidMount() {}

  submit = () => {
    let params = this.props.navigation.state.params;
    params.callback && params.callback(this.state.name, this.state.url);
    this.props.navigation.pop();
  };

  view() {
    return (
      <View style={[baseStyles.container]}>
        <View style={{ marginTop: 14, marginHorizontal: 0 }}>
          <List
            containerStyle={[baseStyles.listContainer, baseStyles.pageSpace]}
          >
            <ListItem
              wrapperStyle={[
                baseStyles.listItemWrapper,
                baseStyles.lastItemStyle,
                {
                  paddingTop: 15,
                  paddingBottom: 15
                }
              ]}
              titleSubtitleContainerStyle={styles.titleSubtitleContainer}
              titleStyle={[
                baseStyles.listItemTitleNormal,
                { fontSize: 15, textAlign: "right", paddingRight: 10 }
              ]}
              title={this.i18n("wallet.network.selfRpc.name")}
              rightComponent={
                <View style={[styles.rightContainer]}>
                  <FormInputAdapt
                    ref={ref => (this._amountInput = ref)}
                    containerStyle={[baseStyles.inputContainer]}
                    inputStyle={[
                      baseStyles.inputStyle,
                      {
                        textAlign: "left",
                        fontSize: 15,
                        fontFamily: "DINAlternate-Bold"
                      }
                    ]}
                    placeholder={this.i18n("common.input-title")}
                    placeholderStyle={[
                      {
                        right: 0,
                        textAlign: "left",
                        fontSize: 15,
                        color: "#9D9B99",
                        lineHeight: 20,
                        width: "100%",
                        fontFamily: "DINAlternate-Bold"
                      }
                    ]}
                    selectionColor={colors.walletBg}
                    value={this.state.name}
                    onChangeText={value => {
                      this.setState({ name: value });
                    }}
                    returnKeyType={"next"}
                  />
                </View>
              }
            />
          </List>
          <List
            containerStyle={[baseStyles.listContainer, baseStyles.pageSpace]}
          >
            <ListItem
              wrapperStyle={[
                baseStyles.listItemWrapper,
                baseStyles.lastItemStyle,
                {
                  paddingTop: 15,
                  paddingBottom: 15
                }
              ]}
              titleSubtitleContainerStyle={styles.titleSubtitleContainer}
              titleStyle={[
                baseStyles.listItemTitleNormal,
                { fontSize: 15, textAlign: "right", paddingRight: 10 }
              ]}
              title={this.i18n("wallet.network.selfRpc.url")}
              rightComponent={
                <View style={styles.rightContainer}>
                  <FormInputAdapt
                    ref={ref => (this._amountInput = ref)}
                    containerStyle={[baseStyles.inputContainer]}
                    inputStyle={[
                      baseStyles.inputStyle,
                      {
                        textAlign: "left",
                        fontSize: 15,
                        fontFamily: "DINAlternate-Bold"
                      }
                    ]}
                    placeholder={this.i18n("common.input-title")}
                    placeholderStyle={[
                      {
                        right: 0,
                        textAlign: "left",
                        fontSize: 15,
                        color: "#9D9B99",
                        lineHeight: 20,
                        width: "100%",
                        fontFamily: "DINAlternate-Bold"
                      }
                    ]}
                    selectionColor={colors.walletBg}
                    value={this.state.url}
                    onChangeText={value => {
                      this.setState({ url: value });
                    }}
                    returnKeyType={"next"}
                  />
                </View>
              }
            />
          </List>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 24
          }}
        >
          <TouchOpacity
            title={this.i18n("common.confirm")}
            containerStyle={{
              width: 120,
              height: 44,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.walletBg
            }}
            textStyle={{
              flex: 1,
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 17,
              color: "#fff"
            }}
            onPress={this.submit}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(DefineRpc);
