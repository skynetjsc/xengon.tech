import React, { Component } from 'react';
import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import { fontSize, fonts } from '../../styles';
import { ButtonShadow } from '../index';
import FastImage from "react-native-fast-image";
import { scale } from 'react-native-size-matters';

const {height, width} = Dimensions.get('screen');

class ItemNews extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, style} = this.props;
    const image_blog = data.hasOwnProperty("image_blog") && data.image_blog ? data.image_blog : "";
    const title = data.title && data.title.hasOwnProperty("rendered") && data.title.rendered ? data.title.rendered : "";
    return (
      <ButtonShadow extendStyle={[styles.container, style]} onPress={this.props.onBlogDetail}>
        <FastImage source={{uri: image_blog}} style={styles.image} priority="high" />
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        {/*<View style={{position: 'absolute', right: width*0.025, bottom: width*0.015}}>*/}
        {/*  <Text style={{fontSize:fontSize.f8, color:'#797979', fontFamily: fonts.primaryRegular}}>{data.view} lượt xem</Text>*/}
        {/*</View>*/}
      </ButtonShadow>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: scale(130),
    width: width*0.363,
    borderRadius: width*0.04,
    backgroundColor: '#fff',
    marginBottom: width*0.06,
    marginHorizontal: width*0.03,
    marginTop: width*0.04,
  },
  image: {
    height: width*0.24,
    width: width*0.363,
    // resizeMode: 'contain',
    borderTopRightRadius: width*0.04,
    borderTopLeftRadius: width*0.04
  },
  title: {
    fontSize: fontSize.f12,
    marginHorizontal: width*0.03,
    marginTop: width*0.02,
    color: '#344356',
    fontFamily: fonts.primaryRegular
  }
});

export default ItemNews;
