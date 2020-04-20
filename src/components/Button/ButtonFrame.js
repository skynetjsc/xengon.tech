import React, { Component } from 'react';
import { Text, Dimensions, View } from 'react-native';
import { colors, fonts, fontSize } from '../../styles';
import { ButtonShadow } from '../index';
import { scale } from 'react-native-size-matters';

const {width} = Dimensions.get('screen');

class ButtonFrame extends Component {
  render() {
    const {title, onPress, color, style , image, activeOpacity,disabled} = this.props;
    const imageView = image && (
      <View style={{position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'transparent', justifyContent:'center', flex:1,   }}>
        <View style={{position:'absolute', top:0, bottom:0, right:10, backgroundColor:'transparent', justifyContent:'center', flex:1}}>
          {image}
        </View>
      </View>
    );
    return (
      <ButtonShadow
        extendStyle={{
          height: scale(58),
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: color || colors.defaultBgButton,
          shadowColor: colors.defaultShadowButton,
          shadowOpacity: 0.3,
          marginBottom: scale(15),
          ...style
        }}
        activeOpacity={activeOpacity || 0.5}
        onPress={onPress}
        disabled={disabled}
      >
        {imageView}
        <Text style={{color: colors.white, fontSize: fontSize.f20, fontFamily: fonts.primaryBold,letterSpacing: 1.25}}>{title}</Text>
      </ButtonShadow>
    );
  }
}

export default ButtonFrame;
