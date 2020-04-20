import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View, Alert,Text,
  TouchableOpacity
} from 'react-native';
import { connect } from "react-redux";
import Modal from 'react-native-modal';

import { colors, fonts, fontSize} from '../../styles';
import { HeaderDefault, FooterCart } from '../../containers';
import { ButtonFrame, CartItem } from '../../components';
import APIManager from '../../helpers/APIManager';
import {IconRemoveCart, IconCartNotFound} from '../../styles/svg';

const title = {
  header: "Giỏ hàng của tôi",
  button: "XÁC NHẬN ĐƠN HÀNG"
};

const {width, height} = Dimensions.get("window");

class index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isVisible: false,
      productId: "",
    }
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  onPresentToCheckout = () => {
    this.props.navigation.navigate("Checkout")
  };

  removeProduct = (productId) => {
    const {profile} = this.props.app;
    if(profile) {
      APIManager.getInstance().deleteProductInCart(profile.id, productId)
        .then(res => {
          // console.log("success: ", res);
          this.props.getCartApi(profile.id);
          this.setState({isVisible: false})
        })
        .catch(error => {
          // console.log("error: ", error);
        })
    }
  };

  handleRemove = (productId) => {
    this.setState({
      isVisible: true,
      productId
    })
  };

  handleOffModal = () => {
    this.setState({
      isVisible: false
    })
  };

  render() {
    const {data} = this.props.cart;
    const {isVisible, productId} = this.state;
    return (
      <View style={styles.container}>
        <HeaderDefault
          title={title.header}
          onPressBack={this.onPressBack}
        />
        <View style={{flex: 1}}>
          {
            data && data.list_product.length > 0?  (
              <FlatList
                style={{paddingTop: width*0.05}}
                data={data && data.list_product}
                keyExtractor={data.list_product.name}
                showsVerticalScrollIndicator={false}
                renderItem={({item,index}) => (
                  <CartItem
                    product={item}
                    style={{marginBottom: index === data.list_product.length - 1 ? 22 : 7.5 }}
                    isDelete
                    onPress={() => this.handleRemove(item.product_id)}
                  />
                )}
                ListFooterComponent={(
                  <FooterCart
                    total_money={data.total_money}
                    titleButton={title.button}
                    onPress={this.onPresentToCheckout}
                  />
                )}
              />
            ) : (
              <View style={styles.containerNotFound}>
                <IconCartNotFound />
                <Text style={styles.textNotFound1}>Đang trống</Text>
                <Text style={styles.textNotFound2}>Giỏ hàng của bạn đang trống, vui lòng chọn sản phẩm và thêm vào giỏ.</Text>
              </View>
            )
          }
        </View>
        <Modal isVisible={isVisible}>
          <View style={styles.containerModal}>
            <View style={{marginBottom: width*0.05}}>
              <Text style={styles.text1}>Xoá sản phẩm,</Text>
              <Text style={styles.text2}>Bạn có chắc loại bỏ sản phẩm khỏi giỏ hàng</Text>
            </View>
            <IconRemoveCart />
            <ButtonFrame
              title='ĐỒNG Ý'
              style={styles.buttonModal}
              onPress={() => this.removeProduct(productId)}
            />
            <TouchableOpacity onPress={this.handleOffModal}>
              <Text style={styles.text3}>Xem lại sản phẩm</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  containerModal: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: width,
    marginHorizontal: width*0.04,
    borderRadius: width*0.04,
    paddingHorizontal: width*0.04,
    paddingVertical: width*0.08
  },
  text1: {
    fontSize: fontSize.f26,
    color: colors.red,
    fontFamily: fonts.primaryBold
  },
  text2: {
    fontSize: fontSize.f20,
    color: "#344356",
    fontFamily: fonts.primaryRegular
  },
  text3: {
    color: "#424243",
    fontSize: fontSize.f14,
    fontFamily: fonts.primaryRegular
  },
  buttonModal: {
    backgroundColor: colors.red,
    width: width*0.7,
    marginTop: width*0.05
  },
  containerNotFound: {
    flex: 1,
    alignItems: "center",
    marginTop: width*0.24,
    marginHorizontal: width*0.05,
    paddingHorizontal: width*0.03,
  },
  textNotFound1: {
    fontFamily: fonts.primaryRegular,
    fontSize: fontSize.f33,
    color: '#F76B1C',
    marginVertical: width*0.02
  },
  textNotFound2: {
    textAlign: 'center',
    fontSize: fontSize.f18,
    color: "#344356"
  }
});

const mapStateToProps = (state) =>
  // console.log(state);
   ({
    cart: state.CartReducer,
    app: state.app,
  })
;

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/CartRedux");

  return {
    ...ownProps,
    ...stateProps,
    getCartApi: (userId) => actions.getCartApi(dispatch,userId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(index);

