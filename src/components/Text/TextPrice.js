import React from 'react';
import { Text } from 'react-native';
import format from '../../styles/format';

const TextPrice = props => {
  const {price, style} = props;
  const money = format.numberStringToCurrencyString(price);

  return (
    <Text style={style}>{money}</Text>
  );
};

export default TextPrice;
