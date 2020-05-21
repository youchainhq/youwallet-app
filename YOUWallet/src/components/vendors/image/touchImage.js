/**
 * Created by greason on 2018/9/19.
 *
 */

import React, { PureComponent } from "react";
import { TouchableHighlight, Image } from "react-native";
import FastImage from "react-native-fast-image";

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
      activeOpacity,
      onPress,
      ...attributes
    } = this.props;

    return (
      <TouchableHighlight
        style={[style && style]}
        underlayColor={underlayColor || "transparent"}
        disabled={disabled || false}
        activeOpacity={activeOpacity || 0.8}
        onPress={() => {
          onPress && onPress();
        }}
      >
        <FastImage
          source={source}
          style={[imageStyle && imageStyle]}
          defaultSource={defaultSource && defaultSource}
          {...attributes}
        />
      </TouchableHighlight>
    );
  }
}

export default TouchImage;
