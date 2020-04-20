import React, { Component } from 'react';
import {View, Dimensions, StyleSheet, Image} from 'react-native';
import { colors } from '../styles';
import FastImage from 'react-native-fast-image';

const {height, width} = Dimensions.get('screen');

const Avatar = (props) => (
  <View style={styles.container}>
    <FastImage style={styles.image} source={props.urlImage?{uri: props.urlImage} : require('../../assets/images/avatarDefault.png')} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: width*0.18,
    width: width*0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width*0.09,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.default
  },
  image: {
    height: width*0.14,
    width: width*0.14,
    borderRadius: width*0.07,
    // resizeMode: 'cover'
  }
});
export default Avatar;
