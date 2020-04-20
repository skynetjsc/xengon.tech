import React from 'react';
import {
  View,
  ActivityIndicator, Dimensions, StatusBar
} from 'react-native';
import { colors } from '../styles';

const {width, height} = Dimensions.get('screen');
const LoadingRgba = props => (
  <View style={{position:'absolute',top:0,left:0,zIndex: 1000,width,height,backgroundColor:'rgba(89, 89, 89, 0.3)',...props.style}}>
    <StatusBar backgroundColor='rgba(89, 89, 89, 0.3)' barStyle="dark-content" />

    <View style={{flex: 1, alignItems: "center", justifyContent: "center",zIndex:1000}}>
      <ActivityIndicator size="large" color={colors.default} />
    </View>
  </View>
);

export default LoadingRgba;
