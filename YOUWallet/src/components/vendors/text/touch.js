import React, { PureComponent } from "react";
import { TouchableHighlight, Text } from "react-native";

class TouchText extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      containerStyle,
      textStyle,
      underlayColor,
      disabled,
      numberOfLines,
      selectable,
      ...attributes
    } = this.props;

    return (
      <TouchableHighlight
        {...attributes}
        style={[containerStyle && containerStyle]}
        underlayColor={underlayColor || "transparent"}
        disabled={disabled || false}
      >
        <Text
          selectable={selectable || false}
          numberOfLines={numberOfLines || 1}
          style={[textStyle && textStyle]}
        >
          {title}
        </Text>
      </TouchableHighlight>
    );
  }
}

export default TouchText;
