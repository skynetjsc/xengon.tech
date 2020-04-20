import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import { colors, fonts, fontSize } from '../../styles';

import { ButtonShadow, TextPrice } from '../index';
import {IconSuccess} from '../../styles/svg';
import { connect } from 'react-redux';

const {width} = Dimensions.get('screen');

class ItemProduct extends Component {
  constructor(props) {
    super(props);
    this.state ={
      selected: false,
    }
  }

  handleSelect = (data, listProduct) => {
    const {selected} = this.state;
    // await this.setState({selected: !selected});
    if(!selected){
      listProduct.push(data);
      //console.log("a ", listProduct );
    }else {
      listProduct.splice( listProduct.indexOf(data), 1 );
      //console.log("b ", listProduct );
    }
    this.setState({selected: !selected});
  };

  render() {
    const {data,style, select, handleButton, listProduct} = this.props;
    const name = data.name ? data.name : "";
    const price = data.price && data.hasOwnProperty("price") ? data.price : null;
    const price_discount = data.hasOwnProperty("price_discount") && data.price_discount ? data.price_discount : null;
    const number = data.hasOwnProperty("number") && data.number ? data.number : null;
    const {selected} = this.state;
    return (
      <ButtonShadow extendStyle={[styles.container,style]} onPress={handleButton}>
        <View style={styles.viewImage}>
          <Image source={{uri: data.img}} style={styles.image} />
        </View>
        <View style={styles.viewName}>
          <Text numberOfLines={2} style={styles.textName}>{name}</Text>
        </View>
        <View style={styles.viewPrice}>
          {
            price_discount && (
              <TextPrice style={[styles.textName, {color: colors.default, fontFamily: fonts.primaryBold}]} price={price_discount} />
            )
          }
          {
            price && price !== "0" && <TextPrice style={styles.discount} price={price} />
          }
        </View>
        <TouchableOpacity onPress={() => this.handleSelect(data, listProduct)} style={styles.select}>
          {
            select?
              selected?
                <IconSuccess />
                :
                <Text style={styles.textSelect}>Chọn</Text>
              : null
          }
        </TouchableOpacity>
        {
          number && Number(number) <= 0?
            (
              <View style={styles.viewStatus}>
                <Text style={styles.textStatus}>Hết hàng</Text>
              </View>
            ) : (
              price_discount && price && parseFloat(price) > 0 ? (
                <View style={styles.viewStatus}>
                  <Text style={styles.textStatus}>-{100 - price_discount/price*100}%</Text>
                </View>
              ) : null
            )
        }
      </ButtonShadow>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width*0.36,
    height: width*0.48,
    borderRadius: width*0.04,
    justifyContent:'center',
    alignItems: 'center',
    marginBottom: width*0.06,
    marginHorizontal: width*0.03,
    marginTop: 3
  },
  viewImage: {
    height: width*0.26,
    width: width*0.22,
    marginBottom: width*0.03
  },
  viewName: {
    // marginBottom: width*0.02,
    // marginHorizontal: width*0.02,
    height: width*0.1,
    width: width*0.32,
    fontFamily: fonts.primarySemiBold,
    fontSize: fontSize.f11
  },
  viewPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width*0.32,
    alignItems: 'flex-end'
  },
  image: {
    width: width*0.22,
    height: width*0.26,
  },
  textName: {
    fontSize: fontSize.f12,
    fontFamily: fonts.primarySemiBold
  },
  select: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: width*0.08,
    width: width*0.125,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textSelect: {
    color: '#344356',
    fontFamily: fonts.primaryRegular,
    fontSize: fontSize.f12
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
  discount: {
    textDecorationLine: 'line-through',
    color: '#C4C4C4',
    fontSize: fontSize.f11,
    fontFamily: fonts.primaryBold
  }
});

export default ItemProduct;

