import React from 'react';
import {
  StyleSheet, Text,
  View,
} from 'react-native';

import Dash from 'react-native-dash';

import { colors, fontSize } from '../../styles';

import { ButtonFrame, TextLabel } from '../../components';
import TextPriceString from '../../components/Text/TextPriceString';
import format from '../../styles/format';

const FooterCart = props => {
  const {isHaveSale,total_money,styleButton, titleButton,onPress,couponValue} = props;
  const convertMoney = parseInt(total_money);
  const convertCoupon = parseFloat(couponValue);
  const coupon_money = convertCoupon && convertMoney ? (convertMoney - convertMoney*(convertCoupon/100)) : total_money;
  const money = format.numberStringToCurrencyString(coupon_money);
  return (
    <View style={{marginHorizontal: 25, marginBottom: 30,paddingTop: 10}}>
      <Dash style={{marginBottom: 15}} dashThickness={1} dashGap={3} dashColor={colors.lightGray} />
      {
        isHaveSale && (
          <TextLabel
            titleLeft="Giảm giá"
            titleRight="50.000đ"
            styleRight={{letterSpacing: 0.83, color: colors.darkGray, fontSize: fontSize.f20,textDecorationLine: "line-through"}}
            style={{marginTop: 15}}
          />
        )
      }
      <TextLabel
        titleLeft="Tổng tiền thanh toán"
        titleRight={money}
        styleRight={{letterSpacing: 1}}
      />
      <TextPriceString price={total_money} />
      <ButtonFrame
        title={titleButton}
        style={{marginHorizontal: 5, ...styleButton}}
        onPress={onPress}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  }
});

export default FooterCart;
