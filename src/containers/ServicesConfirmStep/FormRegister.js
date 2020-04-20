import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View, Dimensions, TextInput, Platform, FlatList,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/vi';

import { IconLocation, IconOval, IconSuccess } from '../../styles/svg';
import { colors, fonts, fontSize,format } from '../../styles';
import { ViewShadow, MultiplePlaceHolders, ButtonFrame, ItemProduct,Text, ModalSelect } from '../../components';
import { connect } from 'react-redux';
import ModalCheckout from '../../modules/cart/ModalCheckout';

const {width} = Dimensions.get("window");

const label = {
  headerTitle: "THỜI GIAN & ĐỊA ĐIỂM THỰC HIỆN",
  headerSubtitle: "Anh/chị vui lòng chọn khung giờ",
  lblLocation: "Địa điểm thực hiện",
  lblPayment: "Loại thanh toán",
  lblDiscount: "Mã khuyến mại",
  titleButton: "XÁC NHẬN",
  relatedProduct: "Sản phẩm mua kèm theo dịch vụ"
};

class FormRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      statusOfModal: "off",
    }
  }

  renderItemProduct = ({ item }) => (
    <ItemProduct
      data={item}
      style={{ marginRight: 15, borderWidth: 1, borderColor: "#34435620", borderRadius: 10}}
      handleButton={() => this.goProductDetail(item.id)}
    />
  );

  goProductDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  handleSelect = (id) => {
    this.setState({id})
  };

  findIndexSelected = () => {
    const {dataAddress} = this.props;
    const {id} = this.state;
    if(dataAddress && dataAddress.length >0) {
      const index = dataAddress.findIndex((item) => item.id === id);
      return index
    }
    return null;
  };

  toggleModal = (mode) => {
    const {dataAddress} = this.props;
    const indexSelect = this.findIndexSelected();
    // console.log(indexSelect);
    if (indexSelect && indexSelect >= 0) {
      const addressSelected = dataAddress[indexSelect];
      this.props.selectAddress(addressSelected);
      const {formRegisterService} = this.props.app;
      if (formRegisterService) {
        formRegisterService.address = addressSelected.address;
      }
      this.props.setFormRegisterService(formRegisterService)
    }
    this.setState({
      statusOfModal: mode,
    });
  };

  handleSelectAddress = () => {
    this.setState({
      statusOfModal: "on"
    });
  };


  render() {
    const {
      dataForm,
      loadingForm,
      onTapDatePicker,
      onTapLocation,
      onChangeText,
      onTapConfirm,
      promotion_code,
      listProductSelected,
      dataAddress,
      styleButton,
      isVisibleDiscount,
      toggleModalDiscount,
      checkPromotion,
      couponValue,
      oldDiscountCode
    } = this.props;
    const indexSelect =  this.findIndexSelected();
    // const addressSelected = dataAddress[indexSelect];
    const {status} = this.props.workshop;
    const {statusOfModal,id} = this.state;
    const addressSelected = id && this.props.workshop.address? this.props.workshop.address: null;
    return (
      <View>
        {
          loadingForm ? (
            <MultiplePlaceHolders />
          ) : (
            <ViewShadow style={styles.container}>
              <Text style={styles.headerTitle}>{label.headerTitle}</Text>
              <Text style={styles.headerSubtitle}>{label.headerSubtitle}</Text>

              <DateField
                onTapDatePicker={onTapDatePicker}
                dataForm={dataForm}
              />

              <LocationField id={id} onTapLocationModal={onTapLocation} dataForm={dataForm} status={status} />

              <TouchableOpacity style={{marginTop: width*0.05}} onPress={() => this.handleSelectAddress()}>
                <Text style={[styles.textWorkShop, {opacity: 0.6}]}>Tại Workshop Xe Ngon</Text>
                {
                  addressSelected && addressSelected.address &&
                  <Text style={styles.textWorkShop}>{addressSelected.address}</Text>
                }
                {
                  id && status === 1?
                    <IconSuccess style={{position: 'absolute', right: 0, bottom: 0}} />
                  :
                    <IconOval style={{position: 'absolute', right: 0, bottom: 0}} />
                }
              </TouchableOpacity>

              <ModalSelect
                statusOfModal={statusOfModal}
                titleModal="Chọn địa chỉ workshop"
                indexSelect={indexSelect}
                dataModal={dataAddress}
                handleSelect={this.handleSelect}
                toggleModal={this.toggleModal}
              />

              <PaymentField
                dataForm={dataForm}
                onChangeText={onChangeText}
                oldDiscountCode={oldDiscountCode}
                toggleModalDiscount={toggleModalDiscount}
                couponValue={couponValue}
              />

              { listProductSelected && listProductSelected.length > 0 && (
                <View>
                  <Text style={styles.headerTitle}>{label.relatedProduct}</Text>
                  <FlatList
                    style={{ paddingVertical: 10, marginHorizontal: -10}}
                    data={listProductSelected}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.name}
                    renderItem={this.renderItemProduct}
                  />
                </View>
                )
              }

              <ButtonFrame
                title={label.titleButton}
                onPress={onTapConfirm}
                style={[{backgroundColor: colors.red, width: 250, alignSelf: "center"}, styleButton]}
              />

              <ModalCheckout
                isVisible={isVisibleDiscount}
                onBackdropPress={toggleModalDiscount}
                title="Nhập mã giảm giá:"
                placeholder="Nhập mã giảm giá của bạn..."
                onChangeText={onChangeText}
                applyModal={checkPromotion}
                valueTextInput={promotion_code}
              />
            </ViewShadow>
          )
        }
      </View>
    );
  }
}

const DateField = props => {
  const {dataForm,onTapDatePicker} = props;
  const {date_booking,startTime,endTime} = dataForm;
  const date = moment(date_booking,format.inputDateFormat).locale("vi").format(format.ddddDDMMYYYY);
  return (
  <View style={styles.timeContainer}>
    <TouchableOpacity
      style={{width: "49%"}}
      onPress={() => onTapDatePicker("date")}
    >
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
    <View style={styles.lineContainer} />
    <View style={styles.timeBody}>
      <TouchableOpacity onPress={() => onTapDatePicker("startTime")}>
        <Text style={styles.time}>{startTime}</Text>
      </TouchableOpacity>
      <Text style={styles.textDefault}>-</Text>
      <TouchableOpacity onPress={() => onTapDatePicker("endTime")}>
        <Text style={styles.time}>{endTime}</Text>
      </TouchableOpacity>
    </View>
  </View>
)};

const LocationField = props => {
  const {onTapLocationModal,dataForm, status,id} = props;
  return (
    <View style={{opacity: id && status === 1 ? 0.4: 1}}>
      <Text style={styles.commonLabel}>{label.lblLocation}</Text>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={onTapLocationModal}
      >
        <Text style={styles.textLocation} numberOfLines={1}>
          {dataForm.address}
        </Text>
        <IconLocation />
      </TouchableOpacity>
    </View>
)};

// TODO: Payment
const PaymentField = props => {
  const {dataForm,oldDiscountCode,toggleModalDiscount,couponValue} = props;
  const {payment} = dataForm;
  const discountAndValue = couponValue !== "" ? `${oldDiscountCode  } (${couponValue}%)` : oldDiscountCode;

  return (
    <View style={styles.paymentContainer}>
      <View style={{width: "49%"}}>
        <Text style={styles.commonLabel}>{label.lblPayment}</Text>
        <Text style={styles.textDefault}>{payment}</Text>
      </View>

      <View style={{...styles.lineContainer, marginRight: fontSize.f22, height: 18}} />

      <TouchableOpacity onPress={toggleModalDiscount}>
        <Text style={styles.commonLabel}>{label.lblDiscount}</Text>
        <Text style={{fontFamily: fonts.primaryBold, color: colors.orange}}>
          {discountAndValue}
        </Text>
      </TouchableOpacity>
    </View>
)};


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    padding: width*0.059,
    marginBottom: 30,
  },
  headerTitle: {
    fontFamily: fonts.primaryBold,
    fontSize: 18,
    color: colors.darkGray,
    marginBottom: 2,
  },
  headerSubtitle: {fontSize: 12, color: colors.darkBlueGray,letterSpacing: 0.86},
  timeContainer: {flexDirection: "row", marginVertical: 20},
  date: {fontSize: fontSize.f14, color: colors.darkBlueGray, textTransform: "uppercase", fontFamily: fonts.primaryBold},
  timeBody: {flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center"},
  time: {fontSize: fontSize.f14, paddingHorizontal: 5, fontFamily: fonts.primaryBold, color: colors.default},
  locationButton: {paddingVertical:2,flexDirection: "row", justifyContent: "space-between"},
  textLocation: {fontFamily: fonts.primarySemiBold, color: colors.darkBlueGray, width: "85%"},
  paymentContainer: {flexDirection: "row", marginTop: 25, marginBottom: 30},
  lineContainer: {
    width: 1, backgroundColor: "#C4C4C4", marginLeft: 8,
  },
  commonLabel: {
    color: colors.grey, marginBottom: 3,fontSize: fontSize.f14
  },
  textDefault: {color: colors.default, fontFamily: fonts.primaryBold},
  textWorkShop: {color: '#344356', fontSize: fontSize.f14, fontFamily: fonts.primaryBold}
});

const mapStateToProps = (state) => ({
  app: state.app,
  workshop: state.WorkShopReducer
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/AddressWorkshop");
  const {setFormRegisterService} = require("../../modules/AppState");
  return {
    ...ownProps,
    ...stateProps,
    selectAddress: (address) => actions.selectAddress(dispatch, address),
    setFormRegisterService: (formRegisterService) => dispatch(setFormRegisterService(formRegisterService)),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(FormRegister);

