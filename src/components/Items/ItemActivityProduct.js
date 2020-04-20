import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { fontSize, fonts } from '../../styles';
import { IconSuccess, IconPending, IconBox } from '../../styles/svg';
import { ButtonShadow } from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import format from '../../styles/format';
import moment from 'moment';

const {width} = Dimensions.get('screen');

const formText = (left, right, color) => (
  <Text style={styles.formText}>
    {left}
    <Text>  </Text>
    <Text style={{fontFamily: fonts.primaryBold, color: color || '#4A4A4A'}}>
      {right}
    </Text>
  </Text>
);
const getActiveIcon = (active) => {
  switch (active) {
    case '1':
      return (<IconPending />);
    case '2':
      return (<IconBox />);
    case '3':
      return (<IconBox />);
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

const ItemActivityProduct = (props)=> {
  const {title, codeProduct, day, total, iconRight, status, onPress} = props;
  const statusIcon = getActiveIcon(status);
  const money = format.numberStringToCurrencyString(total);
  return (
    <ButtonShadow onPress={onPress} extendStyle={styles.container}>
      <Text style={[styles.text, {fontSize: fontSize.f16}]}>
        {title}
      </Text>
      <View style={{}}>
        {formText('Mã đơn hàng: ', codeProduct)}
        {formText('Ngày đặt: ', moment(day, format.inputDateFormat).locale("vi").format(format.ddddDDMMYYYY))}
        {formText('Thành tiền: ', money, '#D81C4D')}
      </View>
      <View style={{position: 'absolute', top: width*0.08, right: width*0.1}}>
        {iconRight}
      </View>
      <View style={styles.status}>
        {statusIcon}
      </View>
    </ButtonShadow>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: width*0.38 ,
    padding: width*0.07,
    marginBottom: width*0.03,
    marginHorizontal: 15
  },
  text: {
    fontSize: fontSize.f13,
    fontFamily: fonts.primaryBold,
    color: '#344356'
  },
  status: {
    position: 'absolute',
    bottom: width*0.06,
    right: width*0.05
  },
  formText: {
    fontSize: fontSize.f13,
    fontFamily:fonts.primarySemiBold,
    color: '#4A4A4A',
    marginBottom: width*0.01
  }
});

export default ItemActivityProduct;
