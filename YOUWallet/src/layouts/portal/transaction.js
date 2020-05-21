/**
 * Created by greason on 2019/4/16.
 */

import _ from "lodash";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import React from "react";
import { View, Alert, Platform, FlatList } from "react-native";

import baseStyles from "../../styles/base";
import EmptyView from "../../components/common/flatlist/emptyView";

import Item from "../../components/app/transaction/index";
import theme from "../../common/theme";
import TransactionDetail from "./transactionDetail";
import BasePureLayout from "../../common/base/purelayout";
import configs from "../../common/configs";

let colors = theme.colors;

class Transaction extends BasePureLayout {
  constructor(props) {
    super(props);

    let dataSource = _.clone(props.state.wallet.transactions) || [];
    this.state = {
      dataSource: dataSource.reverse()
    };
  }

  navigationOptions() {
    return {
      title: "portal.chain.transaction.title",
      left: true,
      noBorder: true,
      noBg: true,
      containerStyle: { backgroundColor: colors.walletBg },
      goBack: () => {
        this.onGoBack();
      }
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  _onItemPress = data => {
    this.props.navigation.navigate("TransactionDetail", {
      data: data
    });
  };

  _renderItem = ({ item, index }) => {
    return (
      <Item
        data={item}
        index={index}
        onPress={this._onItemPress}
      />
    );
  };

  _renderEmptyView = () => {
    return <EmptyView hint={this.i18n("placeholder.nodata")} />;
  };

  view() {
    return (
      <View style={[baseStyles.container]}>
        <FlatList
          ref={ref => {
            this.flatList = ref;
          }}
          style={baseStyles.container}
          refreshable={false}
          data={this.state.dataSource}
          renderItem={this._renderItem}
          windowSize={4}
          keyExtractor={(item, index) => `${index} - ${item}`}
          ListEmptyComponent={this._renderEmptyView}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
