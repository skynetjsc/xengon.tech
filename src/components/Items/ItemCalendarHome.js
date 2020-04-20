import React, { Component } from 'react';
import {View, Dimensions, StyleSheet, Text, Image} from 'react-native';
import moment from 'moment';

import { colors, fonts, fontSize } from '../../styles';
import {IconSuccess, IconPending, IconConfirmService,IconLocation, IconCarBlue, IconCarRed} from '../../styles/svg';
import { ButtonShadow } from '../index';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale } from 'react-native-size-matters';
import format from '../../styles/format';

const {width} = Dimensions.get('screen');
moment.locale();

class ItemCalendarHome extends Component {

  getActiveIcon = (active) => {
    switch (active) {
      case '1':
        return (<IconPending />);
      case '2':
        return (<IconConfirmService />);
      case '3':
        return (<IconConfirmService />);
      case "4":
        return (<IconSuccess />);
      default:
        return (
          <Icon
            name="ban"
            color="red"
            size={20}
          />
        );
    }
  };


  render() {
    const {data,onPress,activeOpacity, showIconStatus, serviceName } = this.props;
    const { service, address } = data;
    const activeIcon = this.getActiveIcon(data.active);
    const inforCar = service.car_type_id === '1' ? 'Xe 7 chỗ':'Xe 4-5 chỗ';
    // console.log(data);
    return (
      <ButtonShadow
        extendStyle={styles.container}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        <View>
          <View style={{marginVertical: width*0.03}}>
            <Text style={styles.serviceName}>{serviceName}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.viewInfo}>
              <Text style={styles.packageName}>{service.name}</Text>
              <Text style={styles.day}>{moment(data.date_booking, format.inputDateFormat).locale("vi").format(format.ddddDDMMYYYY)}</Text>
            </View>
            <View style={{height: width*0.1, width: 1, backgroundColor: '#D8D8D8', marginHorizontal: width*0.03,}} />
            <View style={styles.viewInfo}>
              <Text style={styles.inforCar}>{inforCar}</Text>
              <Text style={[styles.time, {color: data.active !== "4" ? colors.lightGray : colors.redLight}]}>{data.time_booking}</Text>
            </View>
          </View>
          {
            address && address !== "undefined" && (
              <View style={{flexDirection: 'row', marginTop: width*0.03, width: "92%"}}>
                <IconLocation />
                <Text style={styles.address}>{address}</Text>
              </View>
            )
          }
        </View>
        <View style={styles.iconHeader}>
          <Image source={{uri: service.icon}} style={{width: scale(30), height:scale(39),resizeMode: "contain"}} />
        </View>
        <View style={styles.iconCar}>
          <Image source={{uri: service.img}} style={{width: scale(60), height:scale(44), resizeMode: "contain"}} />
        </View>
        {
          showIconStatus && (
            <View style={styles.status}>
              {activeIcon}
            </View>
          )
        }
      </ButtonShadow>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    minHeight: width*0.38 ,
    padding: fontSize.f20,
    marginBottom: 7.5,
    marginHorizontal: 15,
    paddingBottom:  width*0.05
  },
  viewInfo: {
    height: width*0.1,
    justifyContent: 'space-between'
  },
  status: {
    position: 'absolute',
    bottom: width*0.06,
    right: width*0.05
  },
  serviceName: {fontSize: fontSize.f16, fontFamily: fonts.primaryBold, color: colors.darkBlueGray,textTransform: "uppercase"},
  packageName: {fontSize: fontSize.f13, fontFamily: fonts.primaryBold},
  day: {color: colors.lightGray, fontSize: fontSize.f13, fontFamily: fonts.primaryRegular, textTransform: 'capitalize'},
  inforCar: {fontSize: fontSize.f13, fontFamily: fonts.primarySemiBold},
  time:{fontSize: fontSize.f13, fontFamily: fonts.primaryRegular},
  address: {color: '#4A4A4A', fontSize: fontSize.f13, fontFamily: fonts.primaryRegular, marginLeft: width*0.01},
  iconHeader: {position: 'absolute', left: width*0.05333, top: -width*0.032},
  iconCar: {position: 'absolute', top: width*0.05, right: width*0.05}
});

export default ItemCalendarHome;
