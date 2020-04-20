import React from 'react';
import {
  StyleSheet, Text,
  View,
} from 'react-native';

import { colors, fonts, fontSize } from '../../styles';

const TextLabel = props => {
  const {titleLeft, titleRight, styleLeft,styleRight, style} = props;

  return(
    <View style={[styles.textContainer,style]}>
      <Text style={[styles.textLeft,styleLeft]}>{titleLeft}</Text>
      <Text style={[styles.textRight,styleRight]}>{titleRight}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3
  },
  textLeft: {fontSize: fontSize.f16, fontFamily: fonts.primarySemiBold,color: colors.gray},
  textRight: {fontSize: fontSize.f24, fontFamily: fonts.primarySemiBold,  color: colors.redLight}
});

export default (TextLabel);
