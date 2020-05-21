/**
 * Created by greason on 2018/9/7.
 */

import React, { PureComponent } from "react";
import { TouchableOpacity, Text } from "react-native";

class TouchOpacity extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      containerStyle,
      textStyle,
      activeOpacity,
      disabled,
      numberOfLines,
      selectable,
      ...attributes
    } = this.props;

    return (
      <TouchableOpacity
        {...attributes}
        style={[containerStyle && containerStyle]}
        activeOpacity={
          typeof activeOpacity !== "undefined" ? activeOpacity : 0.8
        }
        disabled={disabled || false}
      >
        <Text
          selectable={selectable || false}
          numberOfLines={numberOfLines || 1}
          style={[textStyle && textStyle]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
}

export default TouchOpacity;
