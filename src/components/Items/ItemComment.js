import React, { PureComponent } from 'react';
import { Dimensions, View, StyleSheet, Image, Text } from 'react-native';
import moment from 'moment';

import { fonts, fontSize } from '../../styles';
import ViewShadow from '../View/ViewShadow';
import StarRating from "../StarRating";

moment.locale('vi');

const {width} = Dimensions.get('screen');

class ItemComment extends PureComponent {

  calculateDateTimeFlowDay = (created_at) => {
    const today = moment(new Date());
    const createdAt = moment(created_at);
    return today.diff(createdAt, 'day');
  };

  calculateDateTimeFlowHours = (created_at) => {
    const today = moment(new Date());
    const createdAt = moment(created_at);
    return today.diff(createdAt, 'hours');
  };

  calculateDateTimeFlowMinutes = (created_at) => {
    const today = moment(new Date());
    const createdAt = moment(created_at);
    return today.diff(createdAt, 'minutes');
  };

  render() {
    const {data} = this.props;
    // const timeDay = this.calculateDateTimeFlowDay(data.date);
    const timeHours = this.calculateDateTimeFlowHours(data.date);
    const timeMinutes = this.calculateDateTimeFlowMinutes(data.date);
    return (
      <ViewShadow style={styles.container}>
        <View>
          <Image source={data.user_avatar?{uri: data.user_avatar} : require("../../../assets/images/avatarDefault.png")} style={styles.image} />
        </View>
        <View style={{width: width*0.7, marginLeft: width*0.045}}>
          <View style={styles.containerName}>
            <Text style={styles.textName}>{data.user_name}</Text>
            <View>
              <StarRating rating={data.star} />
            </View>
          </View>
          <View style={{width: width*0.6}}>
            <Text style={styles.textComment}>{data.content}</Text>
          </View>
        </View>
        <View style={{position: 'absolute', right: width*0.04, bottom: width*0.035}}>
          <Text style={styles.textTime}>
            {
              timeMinutes < 60? timeMinutes+" phút trước"
                : timeHours < 24 ? timeHours+" giờ trước"
                : moment(data.date).format('DD-MM-YYYY')
            }
          </Text>
        </View>
      </ViewShadow>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: width*0.04,
    backgroundColor: '#fff',
    borderRadius: width*0.03,
    marginTop: width*0.05,
    flexDirection: 'row',
    paddingBottom: width*0.12,
    marginHorizontal: width*0.032
  },
  image: {
    height: 0.1*width,
    width: 0.1*width,
    borderRadius: width*0.05,
  },
  textComment: {
    fontFamily: fonts.primaryRegular,
    fontSize: fontSize.f16,
    color: '#344356'
  },
  textName: {
    color: '#344356',
    fontSize: fontSize.f16,
    fontFamily: fonts.primaryBold
  },
  textTime: {
    fontSize: fontSize.f14,
    fontFamily: fonts.primaryRegular,
    color: '#344356'
  },
  containerName: {
    flexDirection: 'row',
    alignContent:'center',
    justifyContent: 'space-between',
    marginVertical: width*0.015
  }
});

export default ItemComment;
