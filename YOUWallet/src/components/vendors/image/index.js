import React, { PureComponent } from "react";
import { TouchableHighlight, Image } from "react-native";

class TouchImage extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      source,
      style,
      imageStyle,
      underlayColor,
      disabled,
      defaultSource,
      ...attributes
    } = this.props;

    return (
      <TouchableHighlight
        {...attributes}
        style={[style && style]}
        underlayColor={underlayColor || "transparent"}
        disabled={disabled || false}
      >
        <Image
          source={source}
          style={[imageStyle && imageStyle]}
          defaultSource={defaultSource && defaultSource}
        />
      </TouchableHighlight>
    );
  }
}

export default TouchImage;
