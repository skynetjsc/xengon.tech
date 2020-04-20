import * as React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {scale} from 'react-native-size-matters';

import Assets from '../../../assets';
import styles from './styles';

const InfoItem = ({leftImg = null, onPress = () => {}, title, subTitle}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={leftImg} style={styles.leftIcon} />

      <View style={styles.centerContent}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <Text style={styles.subTitle} numberOfLines={1}>
          {subTitle}
        </Text>
      </View>

      <Image source={Assets.ic_arrowRight} style={styles.rightImg} />
    </TouchableOpacity>
  );
};

export default InfoItem;
