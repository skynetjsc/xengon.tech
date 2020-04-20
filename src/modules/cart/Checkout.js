import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Keyboard,
  Alert
} from 'react-native';
import { connect } from "react-redux";

import Toast from "react-native-tiny-toast";
import { HeaderDefault, FooterCart } from '../../containers';
import { ButtonShadow, ViewShadow,Text} from '../../components';

import {IconLocation} from "../../styles/svg"
import { colors, commonStyle, fontSize, fonts} from '../../styles';
import AddressItem from './CheckoutItem/AddressItem';
import APIManager from '../../helpers/APIManager';
import ModalCheckout from './ModalCheckout';
import ActivityIndicator from '../../components/View/ActivityIndicator';

const title = {
  header: "Xác nhận đơn hàng",
  button: "THANH TOÁN",
  newAddress: "Thêm địa chỉ mới",
  note: "Ghi chú:",
  notePlaceHolder: "Ghi chú thêm thông tin...",
  payment: "Hình thức thanh toán",
  discount: "Mã giảm giá (nếu có)"
};

const {width, height} = Dimensions.get("window");

const InfoItem = props => {
  const {onChangeText, addAddress, value_discount, handle_discount} = props;
  return (
    <View>
      <ButtonShadow extendStyle={[styles.common,styles.btnAddNew]} onPress={addAddress}>
        <IconLocation />
        <Text style={styles.btnTitle}>{title.newAddress}</Text>
      </ButtonShadow>

      <PaymentView title={title.payment} value="COD" />

      <ViewShadow style={[styles.common]}>
        <Text style={[commonStyle.h4,{textDecorationLine: "underline"}]}>{title.note}</Text>
        <TextInput
          placeholder={title.notePlaceHolder}
          multiline
          style={styles.textInput}
          onChangeText={(text) => onChangeText(text)}
        />
      </ViewShadow>

      {/* View discount */}
      <PaymentView
        title={title.discount}
        value={value_discount}
        style={{marginBottom: 20}}
        handlePress={handle_discount}
      />
    </View>
  )
};


const PaymentView = props => {
  const {title, value, style, handlePress} = props;
  return (
    <ButtonShadow extendStyle={[styles.common,styles.payment ,style]} onPress={handlePress}>
      <Text style={styles.paymentTitle}>{title}</Text>
      <Text style={styles.paymentValue} numberOfLines={1}>{value}</Text>
    </ButtonShadow>
  )
};

class Checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textNote: "",
      isVisible: false,
      newAddress: "",
      loading: false,
      discount_code: "",
      oldDiscountCode: "",
      isVisibleDiscount: false,
      couponValue: "",
    };
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  onChangeText = (text) => {
    this.setState({textNote: text})
  };

  onPresentToOrder = () => {
    const {profile} = this.props.app;
    const {address} = this.props.address;
    const  {textNote, oldDiscountCode} = this.state;
    this.setState({loading: true});
    if(address !== ""){
      APIManager.getInstance().bookingProduct(profile.id, address, oldDiscountCode ,textNote)
        .then(res => {
          //console.log("data: ", res);
          this.setState({loading: false});
          const {booking_id}= res.data.data;
          this.props.navigation.navigate("MyOrderScreen", {booking_id, isHideBackButton: true});
        })
        .catch(err => {
          //console.log("error: ", err);
        })
    } else {
      Alert.alert("Thông báo!", "Vui lòng chọn địa chỉ giao hàng");
      this.setState({loading: false})
    }
  };

  applyModal = async ()=> {
    const {list_address} = this.props.address;
    let check = 0;
    await list_address.map(address => {
      if(address === this.state.newAddress) {
        check += 1;
      }
      return check;
    });
    if (check !== 0){
      Alert.alert(
        "Thông báo",
        "Địa chỉ này đã tồn tại",
        [{text:"OK", onPress: () =>  this.setState({isVisible: false, newAddress: ""})}]);
    } else {
      this.props.addAddress(this.state.newAddress);
      this.props.selectAddress(this.state.newAddress);
      this.setState({isVisible: false, newAddress: "",})
    }
  };

  openModal = ()=> {
    const {list_address} = this.props.address;
    if(list_address.length < 4){
      this.setState({isVisible: true})
    }else {
      Alert.alert("Thông báo", "Bạn không thể thêm địa chỉ mới!")
    }
  };

  renderAddresses = (list_address) => {
    const selectedAddress = this.props.address.address;
    const {phone} = this.props.app.profile;
    const addressesView = [];
    if(!list_address || !(list_address instanceof  Array) ){
      return addressesView;
    }
    for (let i = 0; i < list_address.length; i++) {
      const address = list_address[i];
      if(addressesView.length < 3){
        addressesView.push(
          <AddressItem
            address={address}
            phone={phone}
            onPress={this.onSelectAddress}
            selected={selectedAddress === address}
            handleDelete={this.handleDelete}
          />
        );
      }
    }
    return addressesView;

  };

  handleDelete = (address) => {
    this.props.deleteAddress(address);
  };

  onSelectAddress = (selectedAddress) => {
    this.props.selectAddress(selectedAddress);
  };

  outClick = () => {
    Keyboard.dismiss();
    this.setState({
      isVisible: false,
      newAddress: ""
    })
  };

  toggleModalDiscount = () => {
    const {isVisibleDiscount,oldDiscountCode,discount_code} = this.state;
    if (isVisibleDiscount) {
      this.setState({ isVisibleDiscount: false, discount_code: oldDiscountCode });
    } else {
      this.setState({ isVisibleDiscount: true, oldDiscountCode: discount_code });
    }
  };

  checkPromotion = () => {
    const {discount_code,oldDiscountCode} = this.state;
    const {profile} = this.props.app;
    const data = {
      user_id: profile.id,
      promotion_code: discount_code,
      service_id: 0
    };

    if (discount_code === "") {
      this.setState({isVisibleDiscount: false,discount_code: "", oldDiscountCode: "", couponValue: ""});
    } else {
      APIManager.getInstance().checkPromotion(data)
        .then(res => {
          const { data } = res;
          //console.log(res);
          if (data && data.errorId === 200) {
            const { value } = data.data;
            if (value) {
              this.setState({ couponValue: value, isVisibleDiscount: false,oldDiscountCode: discount_code});
            }
          } else {
            this.setState({isVisibleDiscount: false,discount_code: oldDiscountCode});
            Toast.show(data.message);
          }
        })
        .catch(err => {
          //console.log(err);
          Alert.alert("Đã xảy ra lỗi vui lòng thử lại!");
        });
    }
  };

  render() {
    const {isVisible, discount_code,loading, isVisibleDiscount, couponValue,oldDiscountCode} = this.state;
    const {list_address} = this.props.address;
    const {total_money} = this.props.cart.data;
    const addressesView = this.renderAddresses(list_address);
    const discountAndValue = couponValue !== "" ? `${oldDiscountCode  } (${couponValue}%)` : oldDiscountCode;
    return (
      <View style={styles.container}>
        <HeaderDefault
          title={title.header}
          onPressBack={this.onPressBack}
        />
        {
          loading?
            (
              <View style={{marginTop: width*0.7}}>
                <ActivityIndicator style={{flex:1}} visible />
              </View>
            )
            :
            (
              <View style={{flex: 1}}>
                <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop: width*0.05}}>
                  {addressesView}
                  <InfoItem
                    onChangeText={this.onChangeText}
                    addAddress={this.openModal}
                    value_discount={discountAndValue}
                    handle_discount={this.toggleModalDiscount}
                  />

                  <FooterCart
                    total_money={total_money}
                    titleButton={title.button}
                    styleButton={{backgroundColor: colors.black}}
                    onPress={this.onPresentToOrder}
                    couponValue={couponValue}
                    // isHaveSale
                  />
                </ScrollView>
              </View>
            )
        }
        <ModalCheckout
          isVisible={isVisible}
          onBackdropPress={this.outClick}
          title="Địa chỉ"
          placeholder="Nhập địa chỉ của bạn..."
          onChangeText={(text) => this.setState({newAddress: text})}
          applyModal={this.applyModal}
        />
        <ModalCheckout
          isVisible={isVisibleDiscount}
          onBackdropPress={this.toggleModalDiscount}
          title="Nhập mã giảm giá:"
          placeholder="Nhập mã giảm giá của bạn..."
          onChangeText={(text) => this.setState({discount_code: text})}
          applyModal={this.checkPromotion}
          valueTextInput={discount_code}
        />
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F8",
  },
  common: {
    marginVertical: 7.5,
    marginHorizontal: 15,
    padding: 15
  },
  addressDetail: {fontFamily: fonts.primarySemiBold, marginVertical: 5},
  phone: {color: colors.red, fontFamily: fonts.primaryBold},
  btnAddNew: {flexDirection: "row", alignItems: "center"},
  btnTitle: {marginLeft: 5, fontSize: fontSize.f16, fontFamily: fonts.primarySemiBold},
  textInput: {minHeight: 50, fontSize: fontSize.f15, marginTop: 5, fontFamily: fonts.primaryRegular},
  payment: {flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: 'wrap' },
  paymentTitle: {fontSize: fontSize.f16, color: colors.darkBlueGray},
  paymentValue: {fontSize: fontSize.f16, fontFamily: fonts.primaryBold, color: colors.defaultBgButton, paddingHorizontal: 5},
  containerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: width*0.4,
    width: width*0.94,
    backgroundColor: colors.defaultBackgroundColor,
    marginLeft: -width*0.02,
    borderRadius: width*0.04,
  }
});

const mapStateToProps = (state) =>
  // console.log(state);
   ({
    address: state.AddressReducer,
    app: state.app,
     cart: state.CartReducer,
  })
;

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/AddressRedux");

  return {
    ...ownProps,
    ...stateProps,
    addAddress: (address) => actions.addAddress(dispatch,address),
    selectAddress: (address) => actions.selectAddress(dispatch,address),
    deleteAddress: (address) => actions.deleteAddress(dispatch,address),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(Checkout);
