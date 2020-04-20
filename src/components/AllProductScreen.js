import React, {PureComponent} from 'react';
import {View, Dimensions, StyleSheet, FlatList,} from 'react-native';

import HeaderDefault from '../containers/Header/HeaderDefault'
import {colors} from '../styles'
import {ItemProduct} from "./index";
import {connect} from "react-redux";

const {width} = Dimensions.get('screen');

const title = {
  header: "Bán chạy nhất",
};

class AllProductScreen extends PureComponent {
  onPressBack = () => {
    this.props.navigation.goBack();
  };

  goDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  renderItem = ({item, index}) => (
    <ItemProduct
      data={item}
      style={{width: width*0.4267, marginHorizontal: width*0.02}}
      handleButton={() => this.goDetail(item.id)}
    />
  );

  goCart = () => {
    this.props.navigation.navigate('Cart');
  };

  getQuantityCart = () => {
    const {data} = this.props.cart;
    let quantity = 0;
    if(data && data.list_product) {
      data.list_product.map(item => {
        quantity += Number(item.number);
      })
    }
    return quantity;
  };

  render() {
    const {data, titleHeader} = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <HeaderDefault
          isHaveMiniCart
          countProduct={this.getQuantityCart()}
          title={titleHeader?titleHeader:title.header}
          onPressBack={this.onPressBack}
          onPressIconRight={this.goCart}
        />
        <View style={{flex: 1}}>
          <View style={{paddingHorizontal: width*0.04}}>
            <FlatList
              style={{paddingTop: width*0.05}}
              data={data}
              renderItem={this.renderItem}
              numColumns={2}
              contentContainerStyle={{paddingBottom:width*0.32}}
              showsVerticalScrollIndicator={false}
              initialNumToRender={8}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: width*0.04,
    backgroundColor: colors.defaultBackgroundColor
  }
});

const mapStateToProps = (state) => {
  return {
    cart: state.CartReducer,
  };
};
export default connect(
  mapStateToProps,
  undefined,
  null
)(AllProductScreen);
