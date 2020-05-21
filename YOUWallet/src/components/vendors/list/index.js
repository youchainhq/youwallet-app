import React, { PureComponent } from "react";
import { View, StyleSheet, Platform } from "react-native";

import { screen } from "../../../common/utils";

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 20,
    ...Platform.select({
      ios: {
        borderTopWidth: 0.5
      },
      android: {
        borderTopWidth: 1.0
      }
    }),
    borderColor: "#eeedeb",
    backgroundColor: "#fff",
    width: screen.width
  }
});

class List extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, containerStyle, ...attributes } = this.props;

    return (
      <View
        {...attributes}
        style={[styles.listContainer, containerStyle && containerStyle]}
      >
        {children}
      </View>
    );
  }
}

export default List;
