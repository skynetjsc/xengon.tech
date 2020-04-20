import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, Platform, TouchableOpacity } from 'react-native';
import Avatar from '../Avatar';
import { fontSize, fonts } from '../../styles';
import moment from 'moment';

const {width} = Dimensions.get('screen');

class ViewProfile extends Component {

  goUpdateCarNumber = () => {
    this.props.navigation.navigate('EditProfile');
  };

  render() {
    const {background, data} = this.props;
    return (
      <View style={[styles.container, {backgroundColor: background? '#fff': 'transparent',}]}>
        {
          data && (
            <View style={{flexDirection: 'row', marginLeft: width*0.03}}>
              <View style={{alignItems:'center'}}>
                {
                  data.hasOwnProperty("avatar") &&
                  <Avatar urlImage={data.avatar} />
                }
                <View style={styles.rank}>
                  <Text style={styles.textRank}>{data.level|| "THÀNH VIÊN"}</Text>
                </View>
              </View>
              <View style={{marginLeft: width*0.07, justifyContent:'space-between'}}>
                <Text style={styles.textProfile}>Chào, <Text style={{color: '#00BBDC',}}>{data.name}</Text></Text>
                {
                  data.car_number?
                    <Text style={[styles.textProfile, {fontFamily: fonts.primaryExtraBold}]}>{data.car_number}</Text>
                    :
                    <TouchableOpacity onPress={this.goUpdateCarNumber}>
                      <Text style={[styles.textProfile, {fontFamily: fonts.primaryExtraBold}]}>Cập nhật biển số xe</Text>
                    </TouchableOpacity>
                }
                <Text style={{color:'#888892', fontSize: fontSize.f12,fontFamily: fonts.primaryRegular }}>Ngày kích hoạt {moment(data.date).format('l')}</Text>
                <Text style={{fontSize:fontSize.f16, color: '#F79434', fontFamily: fonts.primaryBold}}>{data.point} Điểm </Text>
              </View>
            </View>
          )
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: width*0.96,
    marginLeft: width*0.02,
    padding: width*0.04,
    borderRadius: width*0.05,
    shadowColor: '#000',
    shadowOffset: {
      height: 2, width: 0, blur:4
    },
    shadowOpacity: Platform.OS === 'ios'? 0.2: 1,
    elevation: 4,
  },
  rank: {
    minHeight: width*0.064 ,
    minWidth: width*0.22,
    borderRadius: width*0.025 ,
    backgroundColor: '#F7A085',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width*0.03,
    paddingHorizontal: width*0.02
  },
  textRank: {
    color: '#fff',
    fontSize: fontSize.f12,
    fontFamily: fonts.primaryBold
  },
  textProfile: {
    fontSize: fontSize.f18,
    fontFamily: fonts.primaryBold
  }
});

export default ViewProfile;
