import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';

import { Rating } from 'react-native-ratings';
import { TextPrice, ViewShadow, StarRating } from '../../components';
import { fonts, fontSize } from '../../styles';
import { IconHeartRed, IconHeartWhite, IconPlus, IconMinus } from '../../styles/svg';
import APIManager from '../../helpers/APIManager';

const {width} = Dimensions.get('screen');

class ItemDetailProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      like: ""
    }
  }

  componentDidMount(): void {
    const {data} = this.props;
    this.setState({
      like: data.is_favourite
    })
  }

  handleLike = (userId, productId) => {
    APIManager.getInstance().favouriteProduct(userId, productId)
      .then(res => {
        //console.log("like: ", res);
        this.setState({like: "1"});
        // this.props.getProductDetail(userId, productId);
        this.props.handleFavourite();
      })
      .catch(error => {});
  };

  handleDisLike = (userId, productId) => {
    APIManager.getInstance().unfavouriteProduct(userId, productId)
      .then(res => {
        //console.log("dislike: ", res);
        this.setState({like: "0"});
        // this.props.getProductDetail(userId, productId);
        this.props.handleUnfavourite();
      })
      .catch(error => {/*console.log(error)*/})
  };

  goItemsRate = (userId) => {
    this.props.navigation.navigate('ProductReviews', {userId});
  };

  render() {
    const {data, selectQuantity, quantity, handleMinus, handlePlus, handleAddToCart, userId, reviews, like} = this.props;
    // const {like} = this.state;
    return (
      <ViewShadow style={styles.container}>
        <View style={{flexDirection: 'row',}}>
          <View style={{width: width*0.25}}>
            <Image source={{uri: data.img}} style={{width:width*0.213, height:width*0.256}} />
          </View>
          <View style={styles.right}>
            <Text numberOfLines={2} style={styles.name}>{data.name}</Text>
            <Text style={styles.price}>
              Giá:   <TextPrice
                style={{color: '#00BBDC', fontFamily: fonts.primaryBold}}
                price={data.price_discount !== "0"?data.price_discount : data.price}
              />
            </Text>
            {
              data.price_discount !== "0" ?
                <Text style={styles.initialPrice}>
                  Giá gốc: <TextPrice style={{textDecorationLine: 'line-through'}} price={data.price} />
                </Text>
                : null
            }
            <View
              style={styles.containerRating}>
              <StarRating
                  rating={data.star}
              />
              <TouchableOpacity style={{marginLeft: width*0.05}} onPress={reviews?() => this.goItemsRate(userId) : null}>
                <Text style={styles.textButton}>({data.number_rate} đánh giá)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {
          like === "1"?
            (
              <TouchableOpacity style={styles.buttonLike} onPress={() =>this.handleDisLike(userId, data.id)}>
                <IconHeartRed />
              </TouchableOpacity>
            )
            :
            (
              <TouchableOpacity style={styles.buttonLike} onPress={() =>this.handleLike(userId, data.id)}>
                <IconHeartWhite />
              </TouchableOpacity>
            )
        }
        {
          Number(data.number) <= 0?
            (
              <View style={styles.viewStatus}>
                <Text style={styles.textStatus}>Hết hàng</Text>
              </View>
            )
            :
            (
              data.price_discount !== "0" && <View style={styles.viewStatus}>
                <Text style={styles.textStatus}>-{100 - (data.price_discount/data.price * 100)}%</Text>
              </View>
            )
        }
        {
          selectQuantity?
            (
              <View style={styles.containerBottom}>
                <View style={styles.leftBottom}>
                  <TouchableOpacity style={styles.minus} onPress={handleMinus}>
                    <IconMinus />
                  </TouchableOpacity>
                  <Text style={{fontSize: fontSize.f14, fontFamily: fonts.primaryBold}}>{quantity}</Text>
                  <TouchableOpacity style={styles.minus} onPress={handlePlus}>
                    <IconPlus />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.buttonAddToCart} onPress={handleAddToCart}>
                  <Text style={{fontFamily: fonts.primaryBold, fontSize: fontSize.f14, color: '#fff'}}>Thêm vào giỏ</Text>
                </TouchableOpacity>
              </View>
            ) : null
        }
      </ViewShadow>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: width*0.032,
    backgroundColor: '#fff',
    borderRadius: width*0.04,
    paddingVertical: width*0.0778,
    paddingHorizontal: width*0.0433,
    marginTop: width*0.03
  },
  name: {
    fontSize: fontSize.f14,
    fontFamily: fonts.primaryBold,
    color: '#424243',
    maxHeight: width*0.15
  },
  right: {
    width: width*0.472,
    minHeight: width*0.05,
    // justifyContent: "space-between"
  },
  price: {
    fontSize: fontSize.f13,
    fontFamily: fonts.primaryRegular
  },
  initialPrice: {
    fontSize: fontSize.f12,
    fontFamily: fonts.primaryBold,
    color: '#C4C4C4'
  },
  buttonRating: {
    position: 'absolute',
    right: 0,

  },
  textButton: {
    textDecorationLine: 'underline',
    color: '#424243',
    fontSize: fontSize.f12,
    fontFamily: fonts.primaryRegular,
  },
  buttonLike: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: width*0.125,
    height: width*0.125,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewStatus: {
    position: 'absolute',
    height: width*0.05333,
    paddingHorizontal: width*0.01,
    backgroundColor: '#D0021B',
    left: 0,
    top: width*0.04,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: width*0.013,
    borderTopEndRadius: width*0.013
  },
  textStatus: {
    color: '#fff',
    fontSize: fontSize.f10,
    fontFamily: fonts.primaryBold,
    letterSpacing: 0.62
  },
  leftBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    height: width*0.1,
    width: width*0.328,
    backgroundColor: 'rgba(0,210,233,0.15)',
    justifyContent: 'space-between',
    borderRadius: width*0.02666667,
    marginRight: width*0.0433,
  },
  minus: {
    padding: width*0.04,
  },
  buttonAddToCart: {
    height: width*0.1,
    width: width*0.488,
    backgroundColor: '#00D2E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width*0.0266667
  },
  containerBottom: {
    flexDirection: 'row',
    marginTop: width*0.0773333

  },
  containerRating: {
    width: width*0.4,
    maxHeight: width*0.05,
    alignItems: 'flex-end',
    flexDirection: "row",
    justifyContent: "space-between",
  }
});

export default ItemDetailProduct;
