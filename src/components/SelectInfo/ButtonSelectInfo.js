import * as React from 'react';
import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import {scale} from 'react-native-size-matters';

import Assets from '../../../assets';
import styles from './styles';
import { commonStyle, fonts } from '../../styles';

const ButtonSelectInfo = ({styleText,title, content, style, ...props}) => {
  return (
    <TouchableOpacity style={[styles.wrapper, styles.flex, style]} {...props}>
      <View style={styles.leftContent}>
        <Text style={[styles.textTitle, {fontFamily: fonts.primaryRegular}]} numberOfLines={1}>
          {title}
        </Text>

        <Text style={[commonStyle.h3,{fontFamily: fonts.primarySemiBold}, styleText]} numberOfLines={1}>
          {content}
        </Text>
      </View>

      <Image source={Assets.ic_arrowRight} style={styles.imgRight} />
    </TouchableOpacity>
  );
};

export default ButtonSelectInfo;
