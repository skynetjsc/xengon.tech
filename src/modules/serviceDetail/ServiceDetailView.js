import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View, ScrollView, TouchableOpacity, FlatList, Image,
} from 'react-native';

import APIManager from "../../helpers/APIManager"
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import {Linking} from 'react-native';

import { colors, commonStyle, fonts, fontSize } from '../../styles';
import {
  IconSuccess,
  IconPending,
  IconConfirmService,
  IconStarRating,
  IconLike,
  IconPhoneCall,
  IconAvatarSpecialist,
  IconRemoveCart,
  IconCarBlue
} from '../../styles/svg';
import Icon from 'react-native-vector-icons/FontAwesome';

import {HeaderDefault, ListImplementation} from "../../containers"
import {
  ViewShadow,
  ItemCalendarHome,
  ModalFrame,
  ButtonFrame,
  MultiplePlaceHolders, Text, ItemProduct,ModalConfirmRemove
} from '../../components';
import { scale } from 'react-native-size-matters';

const {width, height} = Dimensions.get("window");

const label = {
  headerTitle: "Chi tiết dịch vụ",
  titleSuccess: "Thành công",
  titlePending: "Đang chờ",
  titleCanceled: "Đã huỷ",
  titleConfirm: "Xác nhận",
  titleBtnReject: "HỦY",
  titleBtnSuccess: "ĐÃ HOÀN TẤT",
  titleBtnStartService: "BẮT ĐẦU THỰC HIỆN",
  titleBtnEndService: "KẾT THÚC",
  titleCancelModal: "Huỷ dịch vụ",
  smallTitleCancelModal: "Bạn có chắc muốn huỷ dịch vụ này",
  titleCancel: "Xem lại dịch vụ",
  error: "Đã xảy ra lỗi, mời bạn thử lại.",
  relatedProduct: "Sản phẩm mua kèm theo dịch vụ"
};

class StaffInfo extends React.PureComponent {
//
// Linking.openURL(`tel:${phoneNumber}`)
  constructor(props) {
    super(props)
  }

  onCallStaff = () => {
    const { staff } = this.props;

    if (staff.hasOwnProperty("phone") && staff.phone) {
      const url = `tel://${staff.phone}`;
      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          // console.log(`Can't handle url: ${  url}`);
          alert("Không thể thực hiện cuộc gọi này.")
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => {/*console.error('An error occurred', err)*/});
    }
  };

  render() {
    const { staff, active } = this.props;
    const name = staff.hasOwnProperty("name") ? staff.name : "Chuyên gia";
    const exp_name = staff.hasOwnProperty("exp_name") ? staff.exp_name : "";
    const exp = staff.hasOwnProperty("exp") ? staff.exp : "3 năm kinh nghiệm";
    const star = staff.hasOwnProperty("total_rate") ? staff.star : 4.5;
    const avatar = staff.hasOwnProperty("avatar") ? staff.avatar : "";
    return (
      <ViewShadow style={styles.specialistContainer}>
        <View style={styles.specialistBody}>
          <ViewShadow style={{ padding: 5.5, borderRadius: 50, marginRight: 15 }}>
            {
              avatar ?
                <FastImage source={{ uri: avatar }} style={{ width: 74, height: 74, borderRadius: 37, }}/> :
                <IconAvatarSpecialist width={74} height={74} />
            }
          </ViewShadow>
          <View>
            <Text style={commonStyle.h4}>{name}</Text>
            <Text style={{ fontFamily: fonts.primarySemiBold }}>{exp_name}</Text>
            <Text style={{ color: colors.red }}>{exp}</Text>
            <Text style={{ marginTop: 5, fontSize: fontSize.f13 }}>
              <IconStarRating /> {star}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.staffIconLike}>
          <IconLike />
        </TouchableOpacity>
        {
          active !== "4" && (
            <TouchableOpacity style={styles.staffIconPhone} onPress={this.onCallStaff}>
              <IconPhoneCall />
            </TouchableOpacity>
          )
        }

      </ViewShadow>
    )
  }
}

const ServiceReject = props => (
  <View>
    <ButtonFrame
      title={label.titleBtnReject}
      style={styles.buttonReject}
      onPress={props.onRejectService}
    />
    <Text style={styles.textReject}>
      Anh, chị chỉ có thể Huỷ yêu cầu khi hệ thống chưa chuyển
      <Text style={{fontFamily: fonts.primaryBold}}> lệnh dịch vụ </Text>
      đến kỹ thuật viên.
    </Text>
  </View>
);

const ButtonServiceSuccess = () => (
  <ButtonFrame
    activeOpacity={1}
    title={label.titleBtnSuccess}
    image={<IconSuccess width={24} height={24} />}
    style={styles.buttonServiceSuccess}
  />
);

const ButtonStartService = props => (
  <ButtonFrame
    title={props.active === "2" ? label.titleBtnStartService : label.titleBtnEndService}
    style={{...styles.buttonStartService,backgroundColor: props.active === "3" ? colors.red : colors.defaultBgButton}}
    onPress={props.onStartService}
  />
);

const StatusService = props => {
  const {active} = props;

  return (
    active === "4" ? null : active === "1" ? (
      <StatusItems icon={<IconPending />} title={label.titlePending}/>
    ) : active === "5" ? (
      <StatusItems icon={<Icon name="ban" color="red" size={20} />} title={label.titleCanceled} />
    ) : (
      <StatusItems icon={<IconConfirmService />} title={label.titleConfirm}/>
    )
  )
};

const StatusItems = props => (
  <View style={styles.statusItemContainer}>
    {props.icon}
    <Text style={styles.statusItemTitle}>{props.title}</Text>
  </View>
);

class ServiceDetailViewView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: null,
      isVisible: false,
      contentReview: "",
      starsReview: 4,
      isVisibleRemove: false
    }
  }

  componentDidMount(): void {
    const detailId = this.props.navigation.getParam("detailId");
    this.profile = this.props.app.profile;
    if (detailId && this.profile && this.profile.hasOwnProperty("id")) {
      this.getServiceDetail(detailId,this.profile.id);
    }
  }

  /*
    type: 1: đặt dịch vụ, 2: đặt sản phẩm
    "active: 1: đã đặt, 2: xác nhận,
    3: đang xử lý , 4: hoàn thành , 5: huỷ"
 */

  renderItemProduct = ({ item, index }) => {
    // const number = item.hasOwnProperty("number") && parseInt(item.number) ? parseInt(item.number) : 0;
    return (
      <ItemProduct
        data={item}
        style={{ marginLeft: index === 0 ? fontSize.f22 : 6 }}
        listProduct={this.state.listProductSelected}
        handleButton={() => this.goProductDetail(item.product_id)}
      />
    )
  };

  goProductDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  onStartService = (mode) => {
    const {detail,isVisible} = this.state;
    if (detail && detail.hasOwnProperty("active")) {
      const {active} = detail;

      if (active === "2") {
        this.updateStatusBooking("3")
      } else if (active === "3") {
        if (isVisible) {
          if (mode === "reject") {
            this.setState({isVisible: false})
          } else {
            this.updateStatusBooking("4")
          }
        } else {
          this.setState({isVisible: true})
        }
      }
    }
  };

  handleSendRating = () => {
    const {detail,contentReview,starsReview} = this.state;
    if (detail && this.profile) {
      let bodyFormData = new FormData();
      bodyFormData.append('user_id', this.profile.id);
      bodyFormData.append('booking_id', detail.id);
      bodyFormData.append('star', starsReview);
      bodyFormData.append('content', contentReview);

      this.ratingBooking(bodyFormData);
    }
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  toggleCancelModal = () => this.setState({isVisibleRemove: !this.state.isVisibleRemove});

  onCancelService = () => {
    this.setState({isVisibleRemove: false});
    this.updateStatusBooking("5");
  };

  onChangeText = (text) => {
    this.setState({contentReview: text});
  };

  onFinishRating = (stars) => {
    this.setState({starsReview: stars});
  };

  getServiceDetail = (bookingId,userId) => {
    APIManager.getInstance().getBookingServiceDetail(bookingId,userId)
      .then((res) => {
        // console.log(res.data);
        const detail = res.data.data;
        if (detail.hasOwnProperty("id")){
          this.setState({detail});
        } else {
          alert(label.error)
        }
      })
      .catch((err) => {
        // console.log(err);
        alert(label.error)
      })
  };

  updateStatusBooking = (active) => {
    const {detail} = this.state;
    if (detail && detail.hasOwnProperty("id") && this.profile && this.profile.hasOwnProperty("id")) {
      let bodyFormData = new FormData();
      bodyFormData.append('user_id', this.profile.id);
      bodyFormData.append('booking_id', detail.id);
      bodyFormData.append('active', active);

      APIManager.getInstance().updateStatusBooking(bodyFormData)
        .then((res) => {
          // console.log(res.data);
          const { data } = res.data;
          if (data && parseInt(data)) {
            if (active === "5") {
              this.props.navigation.navigate("Home")
            } else {
              detail.active = data;
              this.setState({ detail });
            }
          } else {
            alert(label.error);
          }
        })
        .catch((err) => {
          // console.log(err);
          alert(label.error)
        })
    }
  };

  ratingBooking = (bodyFormData) => {
    APIManager.getInstance().ratingBooking(bodyFormData)
      .then((res) => {
        // console.log(res.response);
        if (res.data.message === "Success") this.setState({isVisible: false},
          () => this.onPressBack());
      })
      .catch((err) => {
        // console.log(err);
        alert(label.error)
      })
  };

  render() {
    const {detail, isVisible,contentReview,isVisibleRemove} = this.state;
    const active = detail && detail.active;
    const staff = detail && detail.staff;
    const process = detail && detail.process;
    const serviceName = detail && detail.category && detail.category.content;
    const listProduct = detail && detail.list_product;
    const ImgModal =  detail && detail.service && detail.service.img ? (
      <FastImage source={{uri: detail.service.img}} style={{width: scale(68), height:scale(50)}} resizeMode="contain" />
    ) : <IconCarBlue />;
    // console.log(listProduct);

    return (
      <View style={styles.container}>
        <HeaderDefault
          title={label.headerTitle}
          onPressBack={this.onPressBack}
        />
        {
          active ? (
            <View style={{flex: 1}}>
              <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: 25,paddingBottom: 70}}>
                <View>
                  <StatusService active={active} />
                  <ItemCalendarHome
                    data={detail}
                    activeOpacity={1}
                    serviceName={serviceName ? serviceName : ""}
                  />
                  {
                    (staff && active !== "1" && active !== "5") && <StaffInfo staff={staff} active={active} />
                  }
                  {
                    process && process.length > 0 && active !== "4" && (
                      <ListImplementation
                        listProcess={process}
                        loadingImplementation={false}
                        style={{marginHorizontal: 15,marginTop: 7.5}}
                      />
                    )
                  }
                </View>

                {
                  listProduct && listProduct.length > 0 && (
                    <View>
                      <Text style={styles.headerTitle}>{label.relatedProduct}</Text>
                      <FlatList
                        style={{ marginBottom: 20 }}
                        data={listProduct}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={this.renderItemProduct}
                      />
                    </View>
                  )}
                {
                  active === "1" ? ( <ServiceReject onRejectService={this.toggleCancelModal} />)
                    : active === "4" && !isVisible && ( <ButtonServiceSuccess /> )
                }
              </ScrollView>
              {
                (active === "2" || active === "3") && <ButtonStartService active={active} onStartService={this.onStartService} />
              }
              <ModalFrame
                isVisible={isVisible}
                rating={active === "4"}
                onChangeText={(text) => this.onChangeText(text)}
                valueInputRating={contentReview}
                onFinishRating={(stars) => this.onFinishRating(stars)}
                handleSuccess={this.onStartService}
                handleReject={() => this.onStartService("reject")}
                handleSendRating={this.handleSendRating}
              />
              <ModalConfirmRemove
                isVisible={isVisibleRemove}
                title={label.titleCancelModal}
                smallTitle={label.smallTitleCancelModal}
                titleCancel={label.titleCancel}
                body={ImgModal}
                onSubmit={this.onCancelService}
                onCancel={this.toggleCancelModal}
              />
            </View>
          ) : (
            <View>
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
            </View>
          )
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor,
  },
  headerTitle: {
    fontFamily: fonts.primaryBold,
    fontSize: fontSize.f18,
    color: colors.darkGray,
    marginBottom: 15,
    marginHorizontal: scale(20)
  },
  specialistContainer: {marginVertical: 7.5, marginHorizontal: 15, padding: fontSize.f25},
  specialistBody: {flexDirection: "row", alignItems: "center", maxWidth: "80%"},
  textReject: { maxWidth: 300, alignSelf: "center", textAlign: "center"},
  buttonReject: {backgroundColor: colors.red,width: 265,alignSelf: "center",marginBottom: 25, marginTop: 10, fontFamily: fonts.primaryBold, fontSize:20},
  buttonServiceSuccess: {width: 265, backgroundColor: colors.silver, marginTop: 30, alignSelf: "center"},
  buttonStartService: {position: "absolute", bottom: 10, left: fontSize.f35, right: fontSize.f35},
  statusItemContainer: {alignSelf: "flex-end", flexDirection: "row", alignItems: "center", marginBottom: 10, marginHorizontal: 15},
  statusItemTitle: {fontSize: 16, color: colors.darkBlueGray, marginLeft: 5},
  staffIconLike: {position: "absolute", top: 15, right: fontSize.f25},
  staffIconPhone: {position: "absolute", bottom: 15, right: fontSize.f25/2}
});

const mapStateToProps = state =>({
  app: state.app
});

export default connect(mapStateToProps)(ServiceDetailViewView);
