/**
 * Created by greason on 2019/4/17.
 */

import { SwipeableFlatList, FlatList } from "react-native";
import React from "react";

export default class FixSwipeableFlatList extends SwipeableFlatList {
  render() {
    return (
      <FlatList
        {...this.props}
        ref={ref => {
          this._flatListRef = ref;
        }}
        extraData={this.state}
        onScroll={this._onScroll}
        renderItem={this._renderItem}
      />
    );
  }
}
