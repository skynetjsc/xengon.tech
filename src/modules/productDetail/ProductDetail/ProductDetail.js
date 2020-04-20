import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native';

import { connect } from 'react-redux';
import ItemDetailProduct from '../../../containers/ProductDetail/ItemDetailProduct';
import {ButtonFrame,Text,ViewShadow} from '../../../components';
import Youtube from '../../../components/Youtube';

import { colors, fonts, fontSize, format } from '../../../styles';
import { TabsSelector,HeaderDefault } from '../../../containers';
import APIManager from '../../../helpers/APIManager';

const {width} = Dimensions.get('screen');

const textContent = {
  title: 'Mô tả sản phẩm',
  HDSD: "Hướng dẫn sử dụng sản phẩm"
};

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSelectorSelected: 0,
      quantity: 1,
      videoId: ""
    }
  }

  componentDidMount(): void {
    this.getProductDetail();
    // this.getVideoId();
  }

  checkVideo = () => {
    const listSelect = [
      {
        title: "MÔ TẢ",
      },
      {
        title: "HƯỚNG DẪN SD",
      },
      {
        title: "VIDEO",
      },
    ];
    const { productDetail } = this.props;
    // const video = productDetail.data && productDetail.data.hasOwnProperty('video')? productDetail.data.video : null;
    const video = productDetail.data && Object.prototype.hasOwnProperty.call(productDetail.data, 'video')? productDetail.data.video : null;
    if(!video){
      listSelect.splice(2,1);
    }
    return listSelect;
  };

  getProductDetail = () => {
    const {productId} = this.props.navigation.state.params;
    const {profile} = this.props.app;
    this.props.getProductDetail(profile.id, productId);
  };

  getVideoId = () => {
    const { productDetail } = this.props;
    // const video = productDetail.data && productDetail.data.hasOwnProperty('video')? productDetail.data.video : null;
    const video = productDetail.data && Object.prototype.hasOwnProperty.call(productDetail.data, 'video')? productDetail.data.video : null;

    const match = video.match(format.getVideoID);
    if (match && match[2].length === 11) {
      // this.setState({videoId: match[2]});
      //console.log('videoID: ', match[2]);
      return(match[2])
    }
    return null;
  };

  onTapSelector = (index) => {
    this.setState({indexSelectorSelected: index});
  };

  goBack = () => {this.props.navigation.goBack()};

  handlePlus = () => {
    let {quantity} = this.state;
    const {data} = this.props.productDetail;

    if(data && Object.prototype.hasOwnProperty.call(data, 'number')) {
      quantity += 1;
      // eslint-disable-next-line radix
      if(parseInt(data.number) >= quantity) {
        this.setState({ quantity });
      }
      else if (parseInt(data.number)<= 0){
          Alert.alert("Thông báo", `Hiện tại trong kho đang hết hàng.`)
      }
      else {
          Alert.alert("Thông báo", `Hiện tại trong kho chỉ còn ${data.number} sản phẩm.`)
      }
    }

  };

  handleMinus = () => {
    const {quantity} = this.state;
    const {data} = this.props.productDetail;
    if(data.hasOwnProperty('number') && data.number >0){
      if(this.state.quantity > 0) {
        this.setState({ quantity: quantity - 1 })
      }
    }
  };

  viewContent = (indexSelectorSelected) => {
    const {data} = this.props.productDetail;
    switch (indexSelectorSelected) {
      case 0:
        return (
          <View>
            <Text style={styles.textTitleContent}>{textContent.title}</Text>
            <Text style={{lineHeight: 20, color: colors.gray}}>{data && data.content}</Text>
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.textTitleContent}>{textContent.HDSD}</Text>
            <Text style={{lineHeight: 20, color: colors.gray}}>{data && data.instruction}</Text>
          </View>
        );
      case 2:
        return (
          <View>
            {/* <Youtube videoId={this.state.videoId} /> */}
            <Youtube videoId={this.getVideoId()} />
          </View>
        );
      default: return null
    }
  };

  goCart = () => {
    this.props.navigation.navigate('Cart')
  };

  addToCart = async () => {
    const {profile} = this.props.app;
    const {productId} = this.props.navigation.state.params;
    const {quantity} = this.state;
      await APIManager.getInstance().deleteProductInCart(profile.id, productId)
        .then(res => {
          //console.log("success: ", res);
        })
        .catch(error => {
          //console.log("error: ", error);
        });
      APIManager.getInstance().addProductToCart(profile.id, productId, quantity)
        .then(res => {
          // console.log("mess: ", res.data.errorId === 404);
          const {errorId} = res.data;
          if(errorId === 404){
            Alert.alert("Thông báo", "Sản phẩm này đã hết hàng! Vui lòng chọn lại sau.")
          }
          this.props.getCartApi(profile.id);
        })
        .catch(err => {
          console.log(err);
        })

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
    const {indexSelectorSelected} = this.state;
    const {data} = this.props.productDetail;
    const listTitle = this.checkVideo();
    return (
      <View style={styles.container}>
        <HeaderDefault
          title='Chi tiết sản phẩm'
          isHaveMiniCart
          countProduct={this.getQuantityCart()}
          onPressBack={this.goBack}
          onPressIconRight={this.goCart}
        />
        <View style={{flex: 1}}>
          <ScrollView style={{minHeight: width*0.7}} showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback>
              <View>
                {
                  data && data.hasOwnProperty("id") && (
                    <ItemDetailProduct
                      data={data}
                      selectQuantity
                      quantity={this.state.quantity}
                      handlePlus={this.handlePlus}
                      handleMinus={this.handleMinus}
                      handleAddToCart={this.addToCart}
                      navigation={this.props.navigation}
                      userId={this.props.app.profile.id}
                      reviews
                      handleFavourite={this.props.handleFavourite}
                      handleUnfavourite={this.props.handleUnfavourite}
                      like={this.props.productDetail.is_favourite}
                    />
                  )}
                <TabsSelector
                  listSelect={listTitle}
                  onPress={this.onTapSelector}
                  indexSelectorSelected={indexSelectorSelected}
                  indexStyle={1}
                  styleItem={listTitle.length === 3}
                />
                <ViewShadow style={styles.content}>
                  {this.viewContent(indexSelectorSelected)}
                </ViewShadow>
                <View style={styles.buttonFooter}>
                  <ButtonFrame title='XEM GIỎ HÀNG' onPress={this.goCart} />
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
  },
  buttonFooter: {
    justifyContent: 'flex-end',
    marginHorizontal: width*0.0853333
  },
  content: {
    minHeight: width*0.816,
    marginHorizontal: width*0.03,
    backgroundColor: '#fff',
    borderRadius: width*0.04,
    paddingVertical: width*0.077333,
    paddingHorizontal: width*0.045,
    marginBottom: width*0.05
  },
  textTitleContent: {
    color: '#344356',
    fontFamily: fonts.primaryBold,
    fontSize: fontSize.f16,
    marginBottom: width*0.05,
    textDecorationLine: "underline"
  }
});

const mapStateToProps = (state) =>
  // console.log(state);
   ({
    productDetail: state.ProductDetailReducer,
    app: state.app,
     cart: state.CartReducer
  })
;

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../../redux/ProductDetailRedux");
  const CartRedux = require("../../../redux/CartRedux");


  return {
    ...ownProps,
    ...stateProps,
    getProductDetail: (userId, productId) => actions.getProductDetail(dispatch,userId, productId),
    getCartApi: (userId) => CartRedux.actions.getCartApi(dispatch, userId),
    handleFavourite:() => actions.handleFavourite(dispatch),
    handleUnfavourite: () => actions.handleUnfavourite(dispatch),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ProductDetail);

