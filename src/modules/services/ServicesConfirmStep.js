import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Platform,
  Alert
} from 'react-native';

import { connect } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import Toast from "react-native-tiny-toast"
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

import moment from 'moment';
import 'moment/locale/vi';

import {HeaderDefault, FormRegister, ServicePackageItems, ModalConfirm} from "../../containers";
import { MultiplePlaceHolders,Loading,Text } from '../../components';
import * as actions from "../AppState";

import { colors, fonts, format} from '../../styles';
import APIManager from '../../helpers/APIManager';
import ActivityIndicator from '../../components/View/ActivityIndicator';

const {width} = Dimensions.get("window");

const label = {
  noteStartTime: "Ngoài khung giờ hiển thị thông báo: Xengon chỉ tiếp nhận dịch vụ muộn nhất lúc 20h trong ngày. Vui lòng chọn thời điểm phù hợp.",
  errRangeStartTime: "Giờ bắt đầu sẽ giới hạn từ 06 giờ sáng đến 20h tối",
  errMinTime: "Giờ bắt đầu và giờ kết thúc không được nhỏ hơn giờ hiện tại",
  errStartTime: "Giờ bắt đầu không được lớn hơn giờ kết thúc",
  errLocation: "Địa điểm dịch vụ không được để trống",
  errBooking: "Đặt lịch không thành công, vui lòng kiểm tra lại dữ liệu",
  minTime: "6:00",
  maxTime: "20:00"
};

const dateFormatter = `${format.inputDateFormat} ${format.time}`;
const apiKey = `&key=AIzaSyDtjGQAxqV5sQ8Ul3MmxiS9wuR4sfiScL0`;

class ServicesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingPackages: true,
      isOpenPicker: false,
      modeDatePicker: "",
      promotion_code: "",
      serviceDetail: null,
      category: null,
      loadingHub: false,
      timeService: 0,
      workShop: [],
      addressSelected: null,
      oldDiscountCode: "",
      isVisibleDiscount: false,
      couponValue: ""
    };
    this.initialDataWithDate = this.initialDataWithDate.bind(this);
  }

  componentDidMount(): void {
    const {serviceDetail,category} = this.props.navigation.state.params;
    this.getWorkShopAddress();
    // console.log("dataaaa: ", category);
    if (serviceDetail && category) {
      const timeService = this.calculateServiceTime(serviceDetail);

      this.setState({serviceDetail,category,timeService});
      this.initialDataForm(serviceDetail,timeService);
    }

    this.getLocation();

    setTimeout(() => {
      this.setState({loadingPackages: false})
    },1000);
  }

  getWorkShopAddress = () => {
    APIManager.getInstance().getWorkShopAddress()
      .then(res => {
        const {data} = res.data;
        this.setState({workShop: data});
        // console.log(res.data)
      })
      .catch(err => {/* console.log(err) */})
  };

  onPress = (addressSelected) => {
    this.setState({addressSelected});
    const {formRegisterService} = this.props.app;
    if (formRegisterService) {
      formRegisterService.address = addressSelected;
    }
    this.props.setFormRegisterService(formRegisterService)
  };

  calculateServiceTime = (serviceDetail) => {
    const time = serviceDetail && serviceDetail.time ? serviceDetail.time : "";
    // time = serviceDetail ? time.replace(",", ".") : "";
    // let timeService = serviceDetail ? parseFloat(time.replace(/\D+$/g, "")) : 0;
    // if (time.toLowerCase().includes("phút")){
    //   timeService = serviceDetail ? parseFloat(time.replace(/\D+$/g, ""))/60 : 0;
    // }

    return time;
  };

  getWorkDay = date => moment(date).format(format.inputDateFormat);

  getStartTime = day => moment(day).add(1,"h").format(format.time);

  initialDataForm = (serviceDetail,timeService) => {
    const today = new Date();
    const {profile} = this.props.app;
    // eslint-disable-next-line camelcase
    const user_id = profile ? profile.id : "";
    const morning = moment('06:00', format.time);
    const lastStartTime = moment('20:00', format.time);
    const lastTimeForWork = moment('23:00', format.time);
    // eslint-disable-next-line camelcase
    this.initialDataWithDate(today, timeService, morning, lastStartTime, lastTimeForWork, (date_booking, startTime, endTime) => {
      // eslint-disable-next-line camelcase
      const promotion_code = "Không";
      const payment = "Tiền mặt";
      const address = "";
      const params = {
        user_id,
        date_booking,
        startTime,
        endTime,
        promotion_code,
        payment,
        address,
      };
      if (serviceDetail) {
        const {id,listProductSelected,process} = serviceDetail;
        params.process = this.convertData(process);
        params.list_product = this.convertData(listProductSelected);
        params.service_id = parseInt(id) ? id : "";
      }
      // console.log(params);
      this.props.setFormRegisterService(params);
    });

  };

  // eslint-disable-next-line react/sort-comp
  initialDataWithDate(startDate, timeService, morning, lastStartTime, lastTimeForWork, callBack) {
    // eslint-disable-next-line camelcase
    const date_booking = this.getWorkDay(startDate);
    const scheduleStart = this.getStartTime(startDate);
    const tomorrow = moment(startDate).add('1','day').set({'hour':0, 'minute':1}).toDate();

    let startTime = scheduleStart;
    const scheduleStartTime = moment(scheduleStart, format.time);
    if(scheduleStartTime.isBefore(morning)) { // early than 6 AM
      startTime = morning.format(format.time);
    } else if(scheduleStartTime.isAfter(lastStartTime)) {
      this.initialDataWithDate(tomorrow, timeService, morning, lastStartTime, lastTimeForWork, callBack);
      return;
    }

    const scheduleEndTime = moment(startTime, format.time).add(timeService,'m');
    if(scheduleEndTime.isAfter(lastTimeForWork) && startTime !== morning.format(format.time)){
      this.initialDataWithDate(tomorrow, timeService, morning, lastStartTime, lastTimeForWork, callBack);
      return;
    }
    const endTime = scheduleEndTime.format(format.time);
    callBack(date_booking, startTime, endTime);
  };

  convertData = (data) => {
    const list = [];
    if (data && data.length > 0) {
      data.map((item) => list.push((item.id)));
      return list.join()
    }

    return ""
  };

  getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        if (position.coords) {
          const {longitude,latitude,altitude} = position.coords;
          // console.log(position);
          if (latitude === 0 && longitude === 0 && altitude === 0) {
            alert("Bạn vui lòng bật GPS để có trải nghiệm tốt hơn")
          } else {
            this.getDetailLocation(latitude,longitude);
          }
        }
      },
      // eslint-disable-next-line no-unused-vars
      error => {/* console.log('Error', JSON.stringify(error) */},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  getDetailLocation = (latitude,longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}
                    &rankby=distance&type=all&${apiKey}`;
      axios.get(url+ apiKey)
        .then(res => {
          const {data} = res;
          if(data && data.results){
            // console.log(res);
            const result = data.results[data.results.length - 1];
            if(result){
              const address = result.vicinity || result.plus_code.compound_code;
              const {formRegisterService} = this.props.app;
              if (formRegisterService) {
                formRegisterService.address = address;
                formRegisterService.latitude = latitude;
                formRegisterService.longitude = longitude;
              }
              this.props.setFormRegisterService(formRegisterService)
            }
          }
        })
        .catch(error => {
          // console.log(error);
        });
    } catch (e) {
      // console.log(e);
    }
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  onTapDatePicker = (mode) => {
    const {isOpenPicker} = this.state;
    this.setState({isOpenPicker: !isOpenPicker, modeDatePicker: mode});
  };

  handleConfirmDate = date => {
    this.transformDateToString(date);
    this.onTapDatePicker()
  };

  transformDateToString = (date) => {
    const {modeDatePicker,timeService} = this.state;
    const {formRegisterService} = this.props.app;
    const date_booking = moment(date).format(format.inputDateFormat);
    const time = moment(date).format(format.time);
    const timePlus = moment(date).add(timeService,"m").format(format.time);
    const timeSub = moment(date).subtract(timeService,"m").format(format.time);

    if (modeDatePicker === "date") {
      formRegisterService.date_booking = date_booking;
    } else if (modeDatePicker === "startTime") {
      formRegisterService.startTime = time;
      formRegisterService.endTime = timePlus;
    } else if (modeDatePicker === "endTime") {
      formRegisterService.startTime = timeSub;
      formRegisterService.endTime = time;
    } else {
      formRegisterService.date_booking = date_booking;
      formRegisterService.startTime = time;
      formRegisterService.endTime = time;
    }
    this.props.setFormRegisterService(formRegisterService)
  };

  setDateInPicker = (modeDatePicker) => {
    const {formRegisterService} = this.props.app;
    if (formRegisterService) {
      const { date_booking, startTime, endTime } = formRegisterService;
      // console.log(`${date_booking} ${startTime}`, endTime );
      if (modeDatePicker === "date") return moment(date_booking, dateFormatter).toDate();
      if (modeDatePicker === "startTime") return moment(`${date_booking} ${startTime}`, dateFormatter).toDate();
      return moment(`${date_booking} ${endTime}`, dateFormatter).toDate();
    }

    return new Date();
  };

  onChangeText = (text) => {
    this.setState({promotion_code: text});
  };

  onTapConfirm = () => {
    const {formRegisterService} = this.props.app;
    const {startTime,endTime,date_booking,address} = formRegisterService;
    const start = moment(startTime,format.time);
    const end = moment(endTime,format.time);
    const minTime = moment(label.minTime,format.time);
    const maxTime = moment(label.maxTime,format.time);
    const now = moment();
    const todayString = moment().format(format.inputDateFormat);

    // console.log(formRegisterService);
    if(start < minTime || start > maxTime) {
      Toast.show(label.errRangeStartTime);
    } else if ((todayString === date_booking) && (start < now || end < now)) {
      Toast.show(label.errMinTime);
    } else if (start >= end) {
      Toast.show(label.errStartTime);
    } else if (address === "") {
      Toast.show(label.errLocation);
    } else {
      this.setState({loadingHub: true});
      this.onAcceptService(formRegisterService);
    }
  };

  onAcceptService = (formRegisterService) => {
    const {user_id,service_id,date_booking,startTime,endTime,address,process,list_product} = formRegisterService;
    const {oldDiscountCode} = this.state;
    const bodyFormData = new FormData();
    bodyFormData.append('user_id', user_id);
    bodyFormData.append('service_id', service_id);
    bodyFormData.append('date_booking', date_booking);
    bodyFormData.append('time_booking', startTime+" - "+endTime);
    bodyFormData.append('promotion_code', oldDiscountCode);
    bodyFormData.append('address', address);
    bodyFormData.append('process', process);
    bodyFormData.append('list_product' , list_product);
    this.setState({loadingHub: false});
    APIManager.getInstance().bookingService(bodyFormData)
      .then(res => {
        const {data} = res;
        if (data && data.errorId === 200) {
          this.props.setModalOpened(true);
        } else if (data.errorId === 406) {
          Alert.alert(data.message);
        } else {
          Alert.alert(label.errBooking);
        }
      })
      .catch(err => {
        //console.log(err);
        // this.setState({loadingHub: false});
        Alert.alert(label.errBooking);
      });
  };

  onTapLocation = () => {
    const {formRegisterService} = this.props.app;
    this.setState({addressSelected: null});
    this.props.navigation.navigate('LocationView');
  };

  toggleModalDiscount = () => {
    const {isVisibleDiscount,oldDiscountCode,promotion_code} = this.state;
    if (isVisibleDiscount) {
      this.setState({ isVisibleDiscount: false, promotion_code: oldDiscountCode });
    } else {
      this.setState({ isVisibleDiscount: true, oldDiscountCode: promotion_code });
    }
  };

  checkPromotion = () => {
    const {formRegisterService} = this.props.app;
    const {promotion_code,oldDiscountCode} = this.state;
    formRegisterService.promotion_code = promotion_code;

    if (promotion_code === "") {
      this.setState({isVisibleDiscount: false,promotion_code: "", oldDiscountCode: "", couponValue: ""});
    } else {
      APIManager.getInstance().checkPromotion(formRegisterService)
        .then(res => {
          const {data} = res;
          //console.log(res);
          if (data && data.errorId === 200) {
            const {value} = data.data;
            if (value) {
              this.setState({couponValue: value,isVisibleDiscount: false,oldDiscountCode: promotion_code});
            }
          } else {
            this.setState({isVisibleDiscount: false,promotion_code: oldDiscountCode});
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
    const {loadingPackages,isOpenPicker,modeDatePicker,promotion_code,serviceDetail,category,loadingHub,couponValue,isVisibleDiscount,oldDiscountCode} = this.state;
    const date = this.setDateInPicker(modeDatePicker);
    const {formRegisterService} = this.props.app;

    return (
      <View style={styles.container}>
        {
          loadingHub && (
            <View style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
              <ActivityIndicator style={{flex:1}} visible />
            </View>
          )
        }
        <HeaderDefault
          title={category ? category.content : ""}
          onPressBack={this.onPressBack}
        />
        {
          !loadingPackages && serviceDetail ? (
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              extraScrollHeight={15}
            >
              <ServicePackageItems
                packages={serviceDetail}
                isSelect
                isFullWidth
                couponValue={couponValue}
              />
              {
                formRegisterService && (
                  <FormRegister
                    loadingForm={loadingPackages}
                    dataForm={formRegisterService}
                    onTapDatePicker={this.onTapDatePicker}
                    onTapConfirm={this.onTapConfirm}
                    onChangeText={this.onChangeText}
                    onTapLocation={this.onTapLocation}
                    promotion_code={promotion_code}
                    oldDiscountCode={oldDiscountCode}
                    listProductSelected={serviceDetail.listProductSelected}
                    navigation={this.props.navigation}
                    dataAddress={this.state.workShop}
                    // onPress={this.onPress}
                    addressSelected={this.state.addressSelected}
                    styleButton={colors.blue}
                    isVisibleDiscount={isVisibleDiscount}
                    toggleModalDiscount={this.toggleModalDiscount}
                    checkPromotion={this.checkPromotion}
                    couponValue={couponValue}
                  />
                )
              }
              <Text style={{textAlign: "center", marginHorizontal: 30, lineHeight: 18,marginBottom: 20}}>{label.noteStartTime}</Text>
            </KeyboardAwareScrollView>
          ) : (
            <View>
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
            </View>
          )
        }
        <DateTimePickerModal
          isVisible={isOpenPicker}
          mode={modeDatePicker === "date" ? "date" : "time"}
          onConfirm={this.handleConfirmDate}
          onCancel={() => this.onTapDatePicker("date")}
          confirmTextIOS="Chọn"
          cancelTextIOS="Huỷ"
          date={date}
          minimumDate={modeDatePicker === "date" && new Date()}
        />
        {
          formRegisterService && serviceDetail && category && (
            <ModalConfirm
              navigation={this.props.navigation}
              dataForm={formRegisterService}
              serviceDetail={serviceDetail}
              category={category}
            />
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
  }
});


const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions)(ServicesView);
