import React from 'react';
import {
  StyleSheet,
  View, Dimensions, Image,
} from 'react-native';

import { scale } from 'react-native-size-matters';
import FastImage from "react-native-fast-image";

import {IconServicePrimary, IconCarBlue} from "../../styles/svg"
import { colors, fonts, fontSize, commonStyle } from '../../styles';

import {ButtonShadow,Text} from "../../components"
import TextPrice from '../../components/Text/TextPrice';

const {width} = Dimensions.get("window");

const label = {
  timePerformFull: "Thời gian thực hiện: ",
  timePerform: "Thực hiện:",
  price: "Giá: ",
  totalPrice: "Tổng chi phí: ",
  primary: "gói tiêu chuẩn",
  pro: "gói cao cấp",
  vip: "gói siêu cấp"
};

const minutesToTimeString = minute => {
  const hours = minute / 60 | 0;
  const minutes = minute % 60 | 0;
  let timeString = '';
  if( hours === 0 && minutes === 0) {
    return 'Trong vài giây';
  }
  let space ='';
  if (hours > 0){
    timeString = `${hours} giờ`;
    space = ' ';
  }
  if(minutes > 0) {
    timeString = `${timeString}${space}${minutes} phút`;
  }
  return timeString;
};

const ServicePackageItems = props => {
  const {packages,isSelect,onPress,isFullWidth,couponValue} = props;
  const name = Object.prototype.hasOwnProperty.call(packages, "name") ? packages.name : "";
  const time = Object.prototype.hasOwnProperty.call(packages, "time")? packages.time : "";
  const price = Object.prototype.hasOwnProperty.call(packages, "price") ? packages.price : "";
  const content = Object.prototype.hasOwnProperty.call(packages, "content") ? packages.content : "";
  const icon = Object.prototype.hasOwnProperty.call(packages, "icon") ? packages.icon : "";
  const img = Object.prototype.hasOwnProperty.call(packages, "img") ? packages.img : "";
  const priceAddedProduct = Object.prototype.hasOwnProperty.call(packages, "priceAddedProduct") ? packages.priceAddedProduct : "";

  //console.log(priceAddedProduct);
  return (
    <ButtonShadow
      accessibilityTraits="button"
      onPress={onPress}
      activeOpacity={isFullWidth ? 1 : 0.8}
      extendStyle={[isFullWidth ? styles.buttonContainerTypeSecond : styles.buttonContainer]}
    >
      <View style={{...styles.iconTop, left: isFullWidth ? 20 : 8}}>
        {
          icon !== "" ?
            <FastImage source={{uri: icon}} style={styles.icon} />
            : <IconServicePrimary style={{marginTop: -14, marginLeft: -20}} />
        }

      </View>
      <View style={styles.bodyContainer}>
        <View style={{marginTop: 25, flex: 1, width: isFullWidth ? "55%" : "100%"}}>
          <Text style={{...commonStyle.h4, textTransform: isFullWidth && "uppercase"}}>{name}</Text>
          <Text style={styles.seat}>{content}</Text>
          <Text style={styles.time}>{isFullWidth ? label.timePerformFull : label.timePerform } {minutesToTimeString(time)}</Text>
          <TextPrice
            style={{
              ...styles.price,
              color: colors.default,
              // color: name.toLowerCase() === label.pro ? colors.orange :
              //         name.toLowerCase() === label.vip ? colors.darkGray : colors.default
            }}
            price={
              isFullWidth ?
                couponValue !== "" ?
                  label.totalPrice+(parseInt(priceAddedProduct) - parseInt(priceAddedProduct)*(couponValue/100))
                  : label.totalPrice+priceAddedProduct
                : label.price+ price
            }
          />

        </View>
        {
          isFullWidth && (
            <View style={{marginLeft: 5}}>
              {
                img !== "" ?
                  <Image source={{uri: img}} style={styles.img} />
                  :  <IconCarBlue width={scale(120)} height={scale(93)} />
              }

            </View>
          )
        }
      </View>
      { isSelect && (<View style={styles.iconBottom} />) }
    </ButtonShadow>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 140,
    maxWidth: 160,
    minHeight: 140,
    marginHorizontal: 10,
    marginVertical: 25,
    padding: 10,
    paddingLeft: 13,
    paddingRight: 5,
  },
  buttonContainerTypeSecond: {
    minHeight: 140,
    paddingHorizontal: fontSize.f22,
    paddingTop: 10,
    paddingBottom: 16,
    marginHorizontal: 15,
    marginTop: 50,
    marginBottom: 25
  },
  bodyContainer : {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  img: {width: scale(117), height: scale(85), resizeMode: "contain"},
  icon: {width: scale(30), height: scale(30)},
  iconTop: {
    position: "absolute",
    left: 0,
    top: -10,
    shadowColor: "#FFD554",
    shadowOffset: {
      width: 0,
      height: 10,
      blur: 25
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  seat: {
    fontSize: fontSize.f12,
    marginTop: 6,
    marginBottom: 2
  },
  time: {
    fontFamily: fonts.primaryRegular,
    fontSize: fontSize.f12,
    color: colors.lightGray
  },
  price: {
    fontSize: fontSize.f13,
    marginTop: 14,
    fontFamily: fonts.primaryBold,
  },
  iconBottom: {
    width: width*0.05,
    height: width*0.05,
    position: "absolute",
    bottom: -7,
    left: 60,
    backgroundColor: colors.white,
    borderRadius: 8,
    transform: [{ rotate: '45deg'}]
  }
});

export default ServicePackageItems;
