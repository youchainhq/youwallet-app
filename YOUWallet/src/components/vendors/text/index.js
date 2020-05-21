import React, { PureComponent } from "react";
import { Text, StyleSheet, Platform } from "react-native";

import fonts from "../../../common/fonts";

const styles = StyleSheet.create({
  text: {
    ...Platform.select({
      android: {
        ...fonts.android.regular
      }
    })
  },
  bold: {
    ...Platform.select({
      android: {
        ...fonts.android.bold
      }
    })
  }
});

class TextElement extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      style,
      children,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      fontFamily,
      ...rest
    } = this.props;

    return (
      <Text
        style={[
          styles.text,
          h1 && {fontSize: 40},
          h2 && {fontSize: 34},
          h3 && {fontSize: 28},
          h4 && {fontSize: 22},
          h5 && {fontSize: 18},
          h6 && {fontSize: 16},
          h1 && styles.bold,
          h2 && styles.bold,
          h3 && styles.bold,
          h4 && styles.bold,
          h5 && styles.bold,
          h6 && styles.bold,
          fontFamily && {fontFamily},
          style && style
        ]}
        {...rest}
      >
        {children}
      </Text>
    );
  }
}

export default TextElement;
