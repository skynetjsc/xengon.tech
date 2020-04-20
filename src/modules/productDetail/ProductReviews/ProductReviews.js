import React, { Component } from 'react';
import {View, StyleSheet, Dimensions, FlatList, TouchableWithoutFeedback, ScrollView} from 'react-native';

import HeaderDefault from '../../../containers/Header/HeaderDefault';
import { colors } from '../../../styles';
import ItemDetailProduct from '../../../containers/ProductDetail/ItemDetailProduct';
import ItemComment from '../../../components/Items/ItemComment';
import {connect} from "react-redux";

const {width} = Dimensions.get('screen');

class ProductReviews extends Component {
  componentDidMount() {
    // console.log("dataDetail: ", this.props.productDetail);
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  renderItem = ({item}) => (
    <ItemComment data={item} />
  );

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

  goCart = () => {this.props.navigation.navigate('Cart')};

  render() {
    const {data} = this.props.productDetail;
    const {userId} = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <HeaderDefault
          title='Đánh giá sản phẩm'
          isHaveMiniCart
          countProduct={this.getQuantityCart()}
          onPressBack={this.goBack}
          onPressIconRight={this.goCart}
        />
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback>
              <View>
                <ItemDetailProduct
                  data={data}
                  navigation={this.props.navigation}
                  userId={userId}
                  handleFavourite={this.props.handleFavourite}
                  handleUnfavourite={this.props.handleUnfavourite}
                  like={this.props.productDetail.is_favourite}
                />
                <View style={{flex: 1}}>
                  <FlatList
                    data={data.list_rating}
                    renderItem={this.renderItem}
                    contentContainerStyle={{paddingBottom: width*0.1}}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  }
});

const mapStateToProps = (state) =>
    ({
      productDetail: state.ProductDetailReducer,
      app: state.app,
      cart: state.CartReducer
    })
;

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../../redux/ProductDetailRedux");


  return {
    ...ownProps,
    ...stateProps,
    getProductDetail: (userId, productId) => actions.getProductDetail(dispatch,userId, productId),
    handleFavourite:() => actions.handleFavourite(dispatch),
    handleUnfavourite: () => actions.handleUnfavourite(dispatch),
  };
}

export default connect(
    mapStateToProps,
    undefined,
    mergeProps
)(ProductReviews);
