import * as React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

import Assets from '../../../assets';
import styles from './styles';
import moment from 'moment';

const UserInfo = props => {
  const {profile} = props;
  const name = profile.hasOwnProperty("name") ? profile.name : "Bạn";
  const point = profile.hasOwnProperty("point") ? profile.point : "0";
  const date = profile.hasOwnProperty("date") ? profile.date : "2020-02-20";
  const avatar = profile.hasOwnProperty("avatar") ? profile.avatar : "";
  const level = profile.level !== "" ? profile.level: "THÀNH VIÊN";

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.7} onPress={props.onPressAvavtar}>
          {
            avatar !== "" ?
              <FastImage source={{uri: avatar}} style={styles.avatar} />
              : <Image source={Assets.ic_avatar} style={styles.avatar} />
          }
        </TouchableOpacity>

        <View style={styles.levelWrapper}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.welcomeText}>
          Chào, <Text style={styles.userName}>{name}</Text>
        </Text>

        <Text style={styles.dayActive}>Ngày kích hoạt {moment(date).format("L")}</Text>
        <Text style={styles.userPoint}>{point} điểm</Text>
      </View>
    </View>
  );
};

export default UserInfo;
