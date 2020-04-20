import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { fonts } from '../../styles';

const mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function dochangchuc(so, daydu) {
  let chuoi = "";
  let chuc = Math.floor(so / 10);
  let donvi = so % 10;
  if (chuc > 1) {
    chuoi = " " + mangso[chuc] + " mươi";
    if (donvi == 1) {
      chuoi += " mốt";
    }
  } else if (chuc == 1) {
    chuoi = " mười";
    if (donvi == 1) {
      chuoi += " một";
    }
  } else if (daydu && donvi > 0) {
    chuoi = " lẻ";
  }

  if (donvi == 5 && chuc >= 1) {
    chuoi += " lăm";
  } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
    chuoi += " " + mangso[donvi];
  }
  return chuoi;
}


function docblock(so, daydu) {
  let chuoi = "";
  let tram = Math.floor(so / 100);
  so = so % 100;
  if (daydu || tram > 0) {
    chuoi = " " + mangso[tram] + " trăm";
    chuoi += dochangchuc(so, true);
  } else {
    chuoi = dochangchuc(so, false);
  }
  return chuoi;
}


function dochangtrieu(so, daydu) {
  let chuoi = "";
  let trieu = Math.floor(so / 1000000);
  so = so % 1000000;
  if (trieu > 0) {
    chuoi = docblock(trieu, daydu) + " triệu";
    daydu = true;
  }
  let nghin = Math.floor(so / 1000);
  so = so % 1000;
  if (nghin > 0) {
    chuoi += docblock(nghin, daydu) + " ngàn đồng";
    daydu = true;
  }
  if (so > 0) {
    chuoi += docblock(so, daydu);
  }
  return chuoi;
}


function docso(so) {
  if (so == 0) return mangso[0];
  let chuoi = "";
  let hauto = "";
  do {
    let ty = so % 1000000000;
    so = Math.floor(so / 1000000000);
    if (so > 0) {
      chuoi = dochangtrieu(ty, true) + hauto + chuoi;
    } else {
      chuoi = dochangtrieu(ty, false) + hauto + chuoi;
    }
    hauto = " tỷ";
  } while (so > 0);
  return chuoi;
}


class TextPriceString extends Component {

  render() {
    const {price} = this.props;
    return (
      <View>
        <Text style={{textAlign: "right", marginBottom: 90,fontStyle: 'italic', fontWeight: "300", marginTop: 5, fontFamily: fonts.primaryRegular}}>({docso(price)} )</Text>
      </View>
    );
  }
}

export default TextPriceString;
