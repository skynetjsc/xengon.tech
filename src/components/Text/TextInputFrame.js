import React, { Component } from 'react';
import { ViewShadow } from '../index';
import { TextInput , StyleSheet, Dimensions } from 'react-native';
import { fonts, fontSize } from '../../styles';

const {width} = Dimensions.get('screen');

class TextInputFrame extends Component {
  render() {
    const {styleContainer, placeholder, onChangeText, onEndEditing, onFocus, autoFocus,defaultValue,value, styleBox} = this.props;
    return (
      <ViewShadow style={[styles.containerSearch, styleContainer]}>
        <TextInput
          placeholder={placeholder}
          style={[styles.textInput, styleBox]}
          onChangeText={onChangeText}
          onEndEditing={onEndEditing}
          onFocus={onFocus}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          value={value}
        />
      </ViewShadow>
    );
  }
}
const styles = StyleSheet.create({
  containerSearch: {
    height: width*0.1333,
    width: width*0.91,
    justifyContent: "center",
    paddingLeft: width*0.045,
  },
  textInput: {
    width: width*0.82,
    fontFamily: fonts.primaryRegular,
    fontSize: fontSize.f16
  }
});

export default TextInputFrame;
