import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet, Text,
  View, TouchableOpacity
} from 'react-native';
import Dash from 'react-native-dash';

import { colors, commonStyle, fonts, fontSize } from '../../styles';
import {IconDelete, IconRatingOrder, IconHeartEmpty, IconHeart} from "../../styles/svg"

import { ViewShadow,TextPrice, StarRating } from "..";

const title = {
  price: "Giá: ",
  number: "Số lượng: ",
  rating: " Viết đánh giá"
};

const {width} = Dimensions.get("window");

const CartItem = props => {
  const {product, style, isShowDash, isDelete, isRating, onPress, isReviewPage} = props;
  const img = product ? product.img : "";
  const name = product ? product.name : "";
  const price = product ? product.price : "";
  const number = product ? product.number : "";
  const star = product ? product.star : "";
  const total_rate = product ? product.number_rate : "0";
  const is_favourite = product ? product.is_favourite : "";

  return (
    <View>
      <ViewShadow style={[styles.viewShadow, style]}>
        <Image source={{uri: img}} style={styles.imgProduct} />
        <View style={{flex: 1}}>
          <Text style={[commonStyle.h4]}>
            {name}
          </Text>
          {
            isReviewPage ? (
              <ReviewPage star={star} total_rate={total_rate} />
            ) : (
              <Body price={price} number={number} />
            )
          }
          <TouchableOpacity
            style={{alignSelf: "flex-end", marginTop: -15}}
            onPress={onPress}
          >
            {isDelete &&  <IconDelete />}
            {isRating &&  (
              product.hasOwnProperty("is_rate") && product.is_rate === 0? (
                <Text style={{color: colors.orange, fontSize: fontSize.f13, marginRight: -5, fontFamily: fonts.primaryRegular}}>
                  <IconRatingOrder />{title.rating}
                </Text>
            ) : null
            )}
          </TouchableOpacity>
        </View>
        {
          isReviewPage && (
            <View style={{position: "absolute", top: 10, right: 10}}>
              {
                is_favourite === "1" ?
                  <IconHeart /> : <IconHeartEmpty />
              }
            </View>
          )
        }
      </ViewShadow>
      <DashItem isShowDash={isShowDash} />
    </View>

  )
};

const ReviewPage = props => (
  <View style={{flexDirection: "row", alignItems: "center", marginLeft: width*0.23}}>
    <StarRating size={12} rating={props.star} styleStar={{position: "absolute", right: 0, marginTop:0 }} />
    <Text style={{fontSize: fontSize.f12}}> ({props.total_rate} đánh giá)</Text>
  </View>
);

const Body = props => (
  <View>
    <Text style={{...commonStyle.regular, marginTop: 5}}>
      {title.price}
      <TextPrice style={styles.price} price={props.price} />
    </Text>
    <Text style={commonStyle.regular}>
      {title.number}
      <Text style={styles.price}>{props.number}</Text>
    </Text>
  </View>
);

const DashItem = props => {
  const {isShowDash} = props;
  return (
    isShowDash ? (
      <Dash
        style={{ marginHorizontal: 10 }}
        dashThickness={1}
        dashGap={3}
        dashColor={colors.lightGray}
      />
    ) : null
  )
};

const styles = StyleSheet.create({
  viewShadow: {minWidth: 100, flexDirection: "row", paddingVertical: fontSize.f20,
    paddingHorizontal: 10, alignItems: "center", margin: 15, marginVertical: 7.5
  },
  imgProduct: {width: width*0.21, height: width*0.24, marginRight: 15},
  price: {fontSize: fontSize.f15, fontFamily: fonts.primaryBold,color: colors.defaultBgButton},
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  }
});

export default CartItem;
