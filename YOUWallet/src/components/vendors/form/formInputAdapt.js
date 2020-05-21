import { PureComponent } from "react";
import React from "react";
import { View, TextInput, StyleSheet, Platform, Text } from "react-native";
import { screen } from "../../../common/utils";
import PropTypes from "prop-types";

/**
 * Created by greason on 2018/11/27.
 */

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10
  },
  placeholder: {
    color: "#767676",
    fontSize: 14,
    top: 2
  },
  input: {
    ...Platform.select({
      android: {
        minHeight: 46,
        width: screen.width
      },
      ios: {
        minHeight: 36,
        width: screen.width
      }
    }),
    width: "100%"
  }
});

export let INPUT_MODE = {
  SINGLE: "single", //单行
  MULTI: "multi" //多行
};

export default class FormInputAdapt extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };

    this.getRef = this.getRef.bind(this);
    this.getRefHandler = this.getRefHandler.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
    this.clearText = this.clearText.bind(this);
  }
  getRef = () => {
    return this.input || this.refs[this.props.textInputRef];
  };

  getRefHandler = () => {
    if (this.props.textInputRef) {
      if (typeof this.props.textInputRef === "function") {
        return input => {
          this.input = input;
          this.props.textInputRef(input);
        };
      } else {
        return this.props.textInputRef;
      }
    } else {
      return input => (this.input = input);
    }
  };

  focus() {
    this.getRef() && this.getRef().focus();
  }

  blur() {
    this.getRef() && this.getRef().blur();
  }

  clearText() {
    this.getRef() && this.getRef().clear();

    this.setState({
      value: ""
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      value: props.value
    });
  }

  render() {
    const {
      containerStyle,
      placeholderContainerStyle,
      placeholderStyle,
      inputStyle,
      multiInputStyle,
      containerRef,
      placeholder,
      clearPlaceholder,
      onChangeText,
      maxLengthManual,
      ...attributes
    } = this.props;

    let isMulti = this.props.inputMode === INPUT_MODE.MULTI;

    return (
      <View
        ref={containerRef}
        style={[styles.container, containerStyle && containerStyle]}
      >
        {placeholder &&
        !clearPlaceholder &&
        (!this.state.value || this.state.value.length === 0) ? (
          <View
            style={[
              styles.input,
              {
                position: "absolute",
                justifyContent: "center"
              },
              placeholderContainerStyle && placeholderContainerStyle
            ]}
          >
            <Text
              style={[
                styles.placeholder,
                isMulti && { top: -2 },
                placeholderStyle && placeholderStyle
              ]}
            >
              {placeholder}
            </Text>
          </View>
        ) : null}
        <TextInput
          {...attributes}
          ref={this.getRefHandler()}
          placeholder=""
          onChangeText={value => {
            if (maxLengthManual && value && value.length > maxLengthManual) {
              value = value.substring(0, maxLengthManual);
            }
            onChangeText && onChangeText(value);
          }}
          style={[
            styles.input,
            {
              color: "#1e1e1e",
              fontSize: 30
            },
            inputStyle && inputStyle,
            isMulti && {
              ...Platform.select({
                android: {
                  top: -18
                },
                ios: {
                  top: 0
                }
              })
            },
            multiInputStyle && multiInputStyle
          ]}
          underlineColorAndroid="transparent"
          multiline={isMulti}
        />
      </View>
    );
  }
}

FormInputAdapt.defaultProps = {
  inputMode: INPUT_MODE.SINGLE
};

FormInputAdapt.propTypes = {
  inputMode: PropTypes.oneOf([INPUT_MODE.SINGLE, INPUT_MODE.MULTI])
};
