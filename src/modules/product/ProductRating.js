import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet, TextInput, Text,
  View, Alert, TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { colors, fonts, fontSize} from '../../styles';

import {HeaderDefault } from '../../containers';
import { ButtonFrame, CartItem, MultiplePlaceHolders, ViewShadow , KeyboardAvoiding} from '../../components';
import {connect} from "react-redux";
import APIManager from "../../helpers/APIManager";

const title = {
  header: "Đánh giá sản phẩm",
  button: "GỬI ĐÁNH GIÁ"
};

const {width, height} = Dimensions.get("window");

class ProductRating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingReview: true,
      productDetail: null,
      rateNumber: 0,
      content: "",
      loading: false
    }
  }

  componentDidMount(): void {
    this.getDetailProduct();
    setTimeout(() => {
      this.setState({loadingReview: false})
    },1000);
  }

  getDetailProduct = () => {
    const {profile} = this.props.app;
    const {data} = this.props.navigation.state.params;
    APIManager.getInstance().getProductDetail(profile.id, data.product_id)
      .then(res => {
        this.setState({productDetail: res.data.data});
      })
      .catch(err => {
        //console.log(err)
      })
  };

  ratingCompleted = (rating) => {
    this.setState({rateNumber: rating});
  };

  handleRating = () => {
    this.setState({loading: true});
    const {profile} = this.props.app;
    const {rateNumber, content} = this.state;
    const {params} = this.props.navigation.state;
    const data = new FormData();
    data.append('user_id', profile.id);
    data.append('product_id', params.data.product_id);
    data.append('star', rateNumber === 0? 4 : rateNumber);
    data.append('content', content);
    data.append('booking_id', params.data.booking_id);

    if(content !== ""){
      APIManager.getInstance().ratingProduct(data)
        .then(res =>{
          this.setState({loading: false, content: ""});
          Alert.alert(
            "Thông báo",
            "Đánh giá thành công!",
            [{text: "OK", onPress: () => this.props.navigation.navigate("Main")}]
          )
        })
        .catch(err => {
          //console.log(err);
        })
    } else {
      Alert.alert("Thông báo", "Vui lòng nhập bình luận về sản phẩm");
      this.setState({loading: false})
    }
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  onPressIconRight = () => {
    this.props.navigation.navigate("Cart");
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
    const {loadingReview,productDetail, loading, content} = this.state;
    return (
      <View style={styles.container}>
        <HeaderDefault
          title={title.header}
          onPressBack={this.onPressBack}
          isHaveMiniCart
          countProduct={this.getQuantityCart()}
          onPressIconRight={this.onPressIconRight}
        />
        {
          !loadingReview && productDetail ? (
            <KeyboardAvoiding>
              <View>
                <CartItem
                  product={productDetail}
                  isReviewPage
                  style={{alignItems:"flex-start", paddingTop: 20, paddingRight: "15%"}}
                  getProductDetail={this.props.getProductDetail}
                />
                <ViewShadow style={styles.formInput}>
                  <AirbnbRating
                    count={5}
                    defaultRating={4}
                    size={28}
                    showRating={false}
                    onFinishRating={this.ratingCompleted}
                  />
                  <View style={styles.viewInput}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Viết nhận xét ..."
                      multiline
                      onChangeText={(text) => this.setState({content: text})}
                      value={content}
                      maxLength={200}
                    />
                  </View>
                </ViewShadow>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleRating}
                >
                  {
                  loading?
                    <ActivityIndicator size="large" color="#fff" />
                    :
                    <Text style={styles.textButton}>{title.button}</Text>
                  }
                </TouchableOpacity>
              </View>
            </KeyboardAvoiding>
          ) : (
            <PlaceHolders />
          )
        }
      </View>
    )
  }
}

const PlaceHolders = () => (
  <View>
    <MultiplePlaceHolders/>
    <MultiplePlaceHolders/>
    <MultiplePlaceHolders/>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  formInput: {marginVertical: 7.5, marginHorizontal: 15, padding: fontSize.f35, paddingVertical: fontSize.f30},
  viewInput: {
    height: width*0.38,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 15,
    alignItems:'center',
    marginTop: width*0.05,
  },
  textInput: {
    width: width*0.65,
    margin: width*0.03,
    fontFamily: fonts.primarySemiBold,
    fontSize: fontSize.f14,
    color: colors.darkBlueGray
  },
  textButton: {color: colors.white, fontSize: 20, fontFamily: fonts.primaryBold,letterSpacing: 1.25},
  button: {
    height: width*0.155,
    marginHorizontal: 30,
    backgroundColor: colors.defaultBgButton,
    borderRadius: 15,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  }
});

const mapStateToProps = (state) => ({
  shop: state.ShopReducer,
  app: state.app,
  cart: state.CartReducer,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/ProductDetailRedux");
  return {
    ...ownProps,
    ...stateProps,
    getProductDetail: (userId, productId) => actions.getProductDetail(dispatch,userId, productId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ProductRating);

