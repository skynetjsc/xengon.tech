import React, {Component} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View, Text,
  TouchableOpacity,
} from 'react-native';
import { connect } from "react-redux";

import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { colors, commonStyle, fonts, fontSize } from '../../styles';
import { IconSuccess, IconPending, IconBox, IconRemoveCart } from '../../styles/svg';
import format from '../../styles/format';

import { HeaderDefault } from '../../containers';
import { CartItem, MultiplePlaceHolders, TextLabel, ButtonFrame, ModalConfirmRemove } from '../../components';
import APIManager from '../../helpers/APIManager';

const title = {
  header: "Đơn hàng của tôi",
  form: "Sản phẩm tự chăm sóc xe",
  code: "Mã đơn hàng:",
  date: "Ngày đặt:",
  address: "Địa chỉ nhận hàng:",
  phone: "Điện thoại:",
  total_money: "Thành tiền:",
  active: "Trạng thái",
  detail: "Chi tiết sản phẩm",
  titleButtonReject:"HUỶ",
  error: "Đã xảy ra lỗi, mời bạn thử lại.",
  titleOnSuccess: "ĐỒNG Ý",
  titleCancelModal: "Huỷ đơn hàng",
  smallTitleCancelModal: "Bạn có chắc muốn huỷ đơn hàng này",
  titleCancel: "Xem lại đơn hàng",
};

const {width} = Dimensions.get("window");

const PlaceHolders = () => (
  <View>
    <MultiplePlaceHolders />
    <MultiplePlaceHolders />
    <MultiplePlaceHolders />
  </View>
);

const OrderDetail = props => {
  const {order} = props;
  const code = `#${order.code}`;

  const statusView = (active) => {
    switch (active) {
      case "1":
        return <Text style={{color: colors.orange}}><IconPending />  Chờ xác nhận</Text>;
      case "2":
        return <Text style={{color: colors.orange}}><IconBox />  Đang đóng gói</Text>;
      case "3":
        return <Text style={{color: colors.orange}}><IconBox />  Đang gửi hàng</Text>;
      case "4":
        return <Text style={{color: colors.success}}><IconSuccess />  Hoàn tất</Text>;
      default:
        return <Text style={{color: colors.red}}> <Icon name="ban" color="red" size={20} />  Đã Huỷ</Text>;
    }
  };

  return (
    <View style={{padding: 20}}>
      <Text style={[commonStyle.h4, {marginBottom: 5}]}>{title.form}</Text>
      <TextLabel
        titleLeft={title.code}
        titleRight={code}
        styleLeft={{fontSize: 13}}
        styleRight={{fontSize: 13,fontFamily: fonts.primaryBold,color: colors.darkGray}}
      />
      <TextLabel
        titleLeft={title.date}
        titleRight={moment(order.date_booking, format.inputDateFormat).locale("vi").format(format.ddddDDMMYYYY)}
        styleLeft={{fontSize: 13}}
        styleRight={{fontSize: 13, fontFamily: fonts.primaryBold,color: colors.darkGray}}
      />
      <TextLabel
        titleLeft={title.total_money}
        titleRight={format.numberStringToCurrencyString(Number(order.total_money))}
        styleLeft={{fontSize: 13}}
        styleRight={{fontSize: 13,fontFamily: fonts.primaryBold}}
      />
      <Text style={{textDecorationLine: "underline",marginTop: 10, marginBottom: 8,color: colors.gray}}>{title.address}</Text>
      <Text style={{fontFamily: fonts.primaryBold,color: colors.darkGray}}>{order.address}</Text>
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",marginTop: 10}}>
        <View>
          <Text style={{textDecorationLine: "underline",marginBottom: 8,color: colors.gray}}>{title.phone}</Text>
          <Text style={{fontFamily: fonts.primaryBold, color: colors.darkGray}}>{order.phone}</Text>
        </View>
        <View>
          <Text style={{textAlign: "right", color: colors.gray}}>{title.active}</Text>
          <Text style={{marginTop: 6, fontFamily: fonts.primaryExtraBold, color: colors.orange}}>{statusView(order.active)}</Text>
        </View>
      </View>
      <Text style={[commonStyle.h4, {marginTop: 20,textDecorationLine: "underline"}]}>{title.detail}</Text>
    </View>
  )
};

const OrderReject = props => {
  if(props.check) {
    return (
      <View style={{marginVertical:30,}}>
        <ButtonFrame
          title={title.titleOnSuccess}
          style={{backgroundColor: "#00D2E9", marginHorizontal: width*0.15}}
          onPress={props.onSuccess}
        />
        <TouchableOpacity style={[styles.textReject]} onPress={props.goActivity}>
          <Text style={{color: colors.red, fontFamily: fonts.primaryBold, fontSize: fontSize.f16}}>Xem lại các hoạt động</Text>
        </TouchableOpacity>
      </View>
    )
  }
    return (
      <View style={{marginVertical:30}}>
        <ButtonFrame
          title={title.titleButtonReject}
          style={styles.buttonReject}
          onPress={props.onRejectService}
        />
        <Text style={styles.textReject}>
          Anh, chị chỉ có thể Huỷ yêu cầu khi hệ thống chưa chuyển
          <Text style={{fontFamily: fonts.primaryBold}}> lệnh đóng gói</Text> hoặc <Text style={{fontFamily: fonts.primaryBold}}>gửi hàng </Text>
          đến kỹ nhân viên.
        </Text>
      </View>
    );

};

class MyOrder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      backgroundReload:false,
      isVisibleRemove: false
    };
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        this.getOrderDetail();
      }
    );
  }

  componentDidMount(): void {
    this.getOrderDetail();
    //console.log("orderDetail: ", this.props.orderDetail)
  }

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    return true;
  }

  componentWillUnmount(): void {
    if(Object.hasOwnProperty.call(this,'willFocusSubscription') &&
      Object.hasOwnProperty.call(this.willFocusSubscription, 'remove')) {
      this.willFocusSubscription.remove();
    }
  }

  getOrderDetail = () => {
    const {booking_id} = this.props.navigation.state.params;
    //console.log("detail: ", this.props.navigation.state.params);
    const {data} = this.props.orderDetail;
    this.setState({backgroundReload: !data});
    if(booking_id){
      this.props.getApiOrderDetail(booking_id, this.props.app.profile.id);}
  }
  ;

  onPressBack = () => {
    const {params} = this.props.navigation.state;
    if(params.check){
      this.props.navigation.navigate('Home');
    }else {
      this.props.navigation.goBack();
    }
  };

  onPresentToProductRating = (data) => {
    this.props.navigation.navigate("ProductRating", {data})
  };

  renderItem = ({item, index}) => {
    const {data} = this.props.orderDetail;
    const list_product = data && data.list_product;
    const isLastItem = index === list_product.length - 1;
    const endCornerRadius = isLastItem? 15: 0;
    const marginBottom = isLastItem? 15:0;
    const selfStyles = {
      shadowOpacity: 0,
      borderRadius: 0,
      marginVertical:0,
      borderBottomLeftRadius:endCornerRadius,
      borderBottomRightRadius:endCornerRadius,
      margin:0,
      marginBottom
    };
    const is_rate = item.hasOwnProperty('is_rate') && item.is_rate === 0;
      return (
        <View style={[styles.cartStyle, selfStyles]}>
          <CartItem
            product={item}
            style={{shadowOpacity: 0,  elevation: 0}}
            isShowDash={!isLastItem}
            isRating={data.active === "4"}
            onPress={is_rate?() => this.onPresentToProductRating(item) : null}
          />
        </View>
      );
  };

  renderHeader = (orderDetail) => (<OrderDetail order={orderDetail} />);

  toggleCancelModal = () => this.setState({isVisibleRemove: !this.state.isVisibleRemove});

  onCancelService = () => {
    this.setState({isVisibleRemove: false});
    this.updateStatusBooking("5");
  };

  updateStatusBooking = (active) => {
    const {data} = this.props.orderDetail;
    const {profile} = this.props.app;
    if (data && Object.hasOwnProperty.call(data,"id") && profile && Object.hasOwnProperty.call(profile,"id")) {
      const bodyFormData = new FormData();
      bodyFormData.append('user_id', profile.id);
      bodyFormData.append('booking_id', data.id);
      bodyFormData.append('active', active);

      APIManager.getInstance().updateStatusBooking(bodyFormData)
        .then((res) => {
          // console.log(res.data);
          const { data } = res.data;
          if (data && parseInt(data)) {
            if (active === "5") {
              this.props.navigation.goBack();
            } else {
              this.getOrderDetail();
            }
          } else {
            //console.log(title.error);
          }
        })
        .catch((err) => {
          //console.log(title.error)
        })
    }
  };

  onSuccess = () => {
    const {id} = this.props.app.profile;
    this.props.getCartApi(id);
    this.props.navigation.navigate("Home")
  };

  goActivity = () => {
    const {id} = this.props.app.profile;
    this.props.getCartApi(id);
    this.props.navigation.navigate("Activity")
  };

  render() {
    const {data, isFetching, error} = this.props.orderDetail;
    //console.log("orderDetail: ", data);
    const {backgroundReload,isVisibleRemove} = this.state;
    const isError = error !== null;
    const list_product =data&& data.list_product;
    const {isHideBackButton} = this.props.navigation.state.params;
    const headerComponent = this.renderHeader(data);

    return (
      <View style={styles.container}>
        <HeaderDefault
          title={title.header}
          onPressBack={this.onPressBack}
          isHideBackButton={isHideBackButton}
        />
        <View style={{flex: 1}}>
          {
            isError || (!backgroundReload && isFetching) ? (
              <PlaceHolders />
              )
              :
              (
                <View style={{flex:1}}>
                  {
                    list_product && (
                      <FlatList
                        style={{backgroundColor:'transparent'}}
                        data={list_product}
                        keyExtractor={list_product.id}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        renderItem={this.renderItem}
                        ListHeaderComponent={headerComponent}
                        ListHeaderComponentStyle={styles.headerComponent}
                        ListFooterComponent={data.active === "1"
                        && (
                          <OrderReject
                            onRejectService={this.toggleCancelModal}
                            check={isHideBackButton}
                            onSuccess={this.onSuccess}
                            goActivity={this.goActivity}
                          />
                        )
                        }
                      />
                    )}
                </View>
              )
          }
        </View>
        <ModalConfirmRemove
          isVisible={isVisibleRemove}
          title={title.titleCancelModal}
          smallTitle={title.smallTitleCancelModal}
          titleCancel={title.titleCancel}
          body={<IconRemoveCart />}
          onSubmit={this.onCancelService}
          onCancel={this.toggleCancelModal}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  headerComponent:{
    backgroundColor: colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius:15,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0,
    shadowRadius: 10,
    // elevation: 10,
    marginLeft: fontSize.f15,
    marginRight: fontSize.f15,
    flex: 1,
    marginTop: 10
  },
  cartStyle: {
    backgroundColor: colors.white,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 10,
    marginLeft: fontSize.f15,
    marginRight: fontSize.f15,
    flex: 1,
  },
  flatlistz: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    margin: fontSize.f15,
    flex: 1
  },
  buttonReject: {backgroundColor: colors.red, width: 265, alignSelf: "center", marginBottom: 25, marginTop: 10, fontFamily: fonts.primaryBold, fontSize:20},
  textReject: { maxWidth: 300, alignSelf: "center", textAlign: "center"},
});

const mapStateToProps = (state) => ({
  app: state.app,
  orderDetail: state.OrderDetailReducer,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/OrderDetailRedux");
  const Cart = require("../../redux/CartRedux");

  return {
    ...ownProps,
    ...stateProps,
    getApiOrderDetail: (orderId, userId) => actions.getApiOrderDetail(dispatch, orderId, userId),
    getCartApi: (userId) => Cart.actions.getCartApi(dispatch, userId)
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(MyOrder);

