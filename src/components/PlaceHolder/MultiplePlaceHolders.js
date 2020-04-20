import React from 'react';
import {
  StyleSheet, View,
} from 'react-native';

import { colors} from '../../styles';
import PlaceHolder from './PlaceHolder'

const MultiplePlaceHolders = props => (
  <View style={{paddingHorizontal: 20,...props.style}}>
    <PlaceHolder />
    <PlaceHolder />
    <PlaceHolder />
  </View>
);

const styles = StyleSheet.create({
  lightStyle: {
    backgroundColor: colors.white,
  },
});

export default MultiplePlaceHolders;
