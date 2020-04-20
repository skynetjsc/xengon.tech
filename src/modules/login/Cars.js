import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView, FlatList, Image, Alert, StatusBar,
} from 'react-native';

import { scale } from 'react-native-size-matters';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';

import { colors, fonts, commonStyle, fontSize} from '../../styles';
import { IconNext, IconNextSmall } from '../../styles/svg';

import { ButtonFrame, ViewShadow, PlaceHolder, ButtonSelectInfo, ModalSelect } from '../../components';
import { HeaderDefault } from '../../containers';

import { connect } from 'react-redux';
import * as actions from '../AppState';
import APIManager from '../../helpers/APIManager';
import NotificationManager from "../../helpers/NotificationManager";

const { width } = Dimensions.get('window');

const title = {
  h1: "Chào anh",
  sub: "Anh chị đang sở hữu mẫu xe nào thì chọn giúp chúng em tiện chăm sóc nhé ạ!",
  btnAcc: "HOÀN TẤT",
  brand: "Hãng xe",
  type: "Phân khúc",
  model: "Mẫu xe",
  messageSubmit: "Bạn vui lòng chọn một mẫu xe."
};

class Cars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listBrand: [],
      listType: [],
      listModel: [],
      name:"",
      statusOfModal: "off",
      dataUpdate : {
        car_brand_id: null,
        car_type_id: null,
        car_model_id: null,
      }
    };
  }

  componentDidMount(): void {
    const name = this.props.navigation.getParam("name");
    this.callCarBrandApi();
    this.callCarTypeApi();
    this.callCarModelApi();
    this.setState({name});
  }

  onPressBack = () => {
    if(Object.hasOwnProperty.call(this.props,'navigation')) {
      const {navigation} = this.props;
      navigation.goBack();
    }
  };

  callCarBrandApi = () => {
    APIManager.getInstance().carBrand()
      .then(res => {
        // console.log(res);
        const listBrand = res.data.data;
        if (listBrand && listBrand.length > 0){
          const {dataUpdate} = this.state;
          dataUpdate.car_brand_id = listBrand[0].id;
          this.setState({listBrand, dataUpdate});
        }
      })
      .catch(err => {
        //console.log(err);
      });
  };

  callCarTypeApi = () => {
    APIManager.getInstance().carType()
      .then(res => {
        const listType = res.data.data;
        if (listType && listType.length > 0) {
          const {dataUpdate} = this.state;
          dataUpdate.car_type_id = listType[0].id;
          this.setState({ listType, dataUpdate });
        }
        // console.log(data);
      })
      .catch(err => {
        //console.log(err);
      });
  };

  callCarModelApi = () => {
    const {dataUpdate} = this.state;
    const {car_brand_id,car_type_id,car_model_id} = dataUpdate;
    if (car_brand_id && car_type_id) {
      APIManager.getInstance().carModel(car_brand_id,car_type_id)
        .then(res => {
          // console.log(res);
          const listModel = res.data.data;
          if (listModel && listModel.length > 0) {
            const index = listModel.findIndex((item) => item.id === car_model_id);
            if (index >= 0) {
              dataUpdate.car_model_id = car_model_id;
            } else {
              dataUpdate.car_model_id = listModel[0].id;
            }
            this.setState({listModel, dataUpdate})
          } else {
            dataUpdate.car_model_id = "";
            this.setState({listModel: [],dataUpdate})
          }
        })
        .catch(err => {
          //console.log(err);
        });
    }
  };

  // callRegisterApi = () => {
  //   const {paramsRegister} = this.props.app;
  //   const {phone,name,car_brand_id,car_type_id,car_model_id} = paramsRegister;
  //   if (phone && name && car_brand_id && car_type_id && car_model_id) {
  //     let bodyFormData = new FormData();
  //     bodyFormData.append('phone', phone);
  //     bodyFormData.append('name', name);
  //     bodyFormData.append('car_brand_id', car_brand_id);
  //     bodyFormData.append('car_type_id', car_type_id);
  //     bodyFormData.append('car_model_id', car_model_id);
  //     bodyFormData.append('is_noti', 1);
  //     APIManager.getInstance().register(bodyFormData)
  //       .then(res => {
  //         const {data} = res.response;
  //         console.log(data);
  //         if (data && data.errorId === 200) {
  //           this.props.setIsLogin();
  //           this.props.setProfile(data.data);
  //           this.props.setParamsRegister(null);
  //           this.props.navigation.navigate("Main");
  //           NotificationManager.getInstance().checkPermission(data.data.id);
  //         } else {
  //           alert("Đăng ký không thành công, vui lòng kiểm tra lại thông tin!");
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         alert("Đăng ký không thành công, vui lòng kiểm tra lại thông tin!");
  //       });
  //   } else {
  //     alert("Đã xảy ra lỗi vui lòng kiểm tra lại thông tin!");
  //   }
  // };

  onPresentToNotification = () => {
    const {dataUpdate} = this.state;
    const {car_brand_id,car_type_id,car_model_id} = dataUpdate;
    const {paramsRegister} = this.props.app;
    if (car_brand_id && car_type_id && car_model_id) {
      paramsRegister.car_brand_id = car_brand_id;
      paramsRegister.car_type_id = car_type_id;
      paramsRegister.car_model_id = car_model_id;

      this.props.setParamsRegister(paramsRegister);
      // this.props.navigation.navigate("Notification");
    } else {
      alert(title.messageSubmit)
    }
    if (paramsRegister.phone && paramsRegister.name && car_brand_id && car_type_id && car_model_id) {
      let bodyFormData = new FormData();
      bodyFormData.append('phone', paramsRegister.phone);
      bodyFormData.append('name', paramsRegister.name);
      bodyFormData.append('car_brand_id', car_brand_id);
      bodyFormData.append('car_type_id', car_type_id);
      bodyFormData.append('car_model_id', car_model_id);
      bodyFormData.append('is_noti', 1);
      APIManager.getInstance().register(bodyFormData)
        .then(res => {
          const {data} = res;
          //console.log(data);
          if (data && data.errorId === 200) {
            this.props.setIsLogin();
            this.props.setProfile(data.data);
            this.props.setParamsRegister(null);
            this.props.navigation.navigate("Notification");
          } else {
            alert("Đăng ký không thành công, vui lòng kiểm tra lại thông tin!");
          }
        })
        .catch(err => {
          //console.log(err);
          alert("Đăng ký không thành công, vui lòng kiểm tra lại thông tin!");
        });
    } else {
      alert("Đã xảy ra lỗi vui lòng kiểm tra lại thông tin!");
    }
  };

  handleSelect = (id) => {
    const {dataUpdate, statusOfModal} = this.state;
    dataUpdate[statusOfModal] = id;
    this.setState({dataUpdate}, () => {
      if (statusOfModal !== "car_model_id") {
        this.callCarModelApi()
      }
    });
  };

  findIndexSelected = () => {
    const {dataUpdate,listBrand,listType,listModel,statusOfModal} = this.state;
    const id = dataUpdate[statusOfModal];
    // console.log(statusOfModal, id);
    let list = [];
    switch (statusOfModal) {
      case "car_brand_id":
        list = listBrand;
        break;
      case "car_type_id":
        list = listType;
        break;
      case "car_model_id":
        list = listModel;
        break;
      default:
        break;
    }
    if (id && list && list.length > 0) {
      return list.findIndex((item) => item.id === id)
    }

    return null;
  };

  getNameCar = (list,id) => {
    // console.log(list,id);
    if (list.length > 0) {
      const index = list.findIndex((item) => item.id === id);
      if (index >= 0 && list[index].hasOwnProperty("name")) {
        return list[index].name;
      }
      return "Chọn xe"
    }

    return "Không có dữ liệu"
  };

  getLogoCar = (list,id) => {
      // console.log(list,id);
    if (list.length > 0) {
      const index = list.findIndex((item) => item.id === id);
      if (index >= 0 && list[index].hasOwnProperty("img")) {
        return list[index].img;
      }
      return null
    }

    return null
  };

  toggleModal = (mode) => this.setState({statusOfModal: mode});

  render() {
    const {listBrand,listType,listModel,name,dataUpdate,statusOfModal} = this.state;
    const uri = this.getLogoCar(listBrand,dataUpdate.car_brand_id);
    const carBrandName = this.getNameCar(listBrand,dataUpdate.car_brand_id);
    const carTypeName = this.getNameCar(listType,dataUpdate.car_type_id);
    const carModelName = this.getNameCar(listModel,dataUpdate.car_model_id);
    const indexSelect =  this.findIndexSelected();
    const titleModal = statusOfModal === "car_brand_id" ? "Chọn hãng xe" : statusOfModal === "car_type_id" ? "Chọn phân khúc xe" : "Chọn mẫu xe";
    const dataModal = statusOfModal === "car_brand_id" ? listBrand : statusOfModal === "car_type_id" ? listType : statusOfModal === "car_model_id" ? listModel : [];

    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderDefault
            title=""
            onPressBack={this.onPressBack}
            styleContainer={{backgroundColor: "rgba(255,255,255,0)"}}
            offShadow
          />
          <View style={{ alignItems: "center",paddingBottom: scale(30)}}>
            <Text style={[commonStyle.h1,styles.title]}>
              {title.h1}
              <Text style={{color: colors.defaultBgButton}}> {name}</Text>
            </Text>

            <Text style={[commonStyle.h3,styles.subTitle]}>{title.sub}</Text>

            <ViewShadow style={{width: width*0.84, alignItems: "center",paddingTop: scale(25)}}>
              {
                uri && (
                  <Image
                    source={{uri}}
                    style={styles.logo}
                    resizeMode='contain'
                  />
                )
              }

              <ScrollView contentContainerStyle={{width: scale(240), marginRight: scale(10)}} showsVerticalScrollIndicator={false}>
                <ButtonSelectInfo title="Hãng xe" content={carBrandName} onPress={() => this.toggleModal("car_brand_id")} style={{shadowOpacity: 0, elevation: 0}} />
                <ButtonSelectInfo title="Phân khúc" content={carTypeName} onPress={() => this.toggleModal("car_type_id")} style={{shadowOpacity: 0, elevation: 0}} />
                <ButtonSelectInfo title="Mẫu xe" content={carModelName} onPress={() => this.toggleModal("car_model_id")} style={{shadowOpacity: 0, elevation: 0}}  />
              </ScrollView>

              <ButtonFrame
                title={title.btnAcc}
                onPress={this.onPresentToNotification}
                image={<IconNext />}
                style={{width: width*0.67, marginBottom: fontSize.f30, marginTop: scale(15)}}
              />
            </ViewShadow>
            {
              dataModal && dataModal.length > 0 && (
                <ModalSelect
                  statusOfModal={statusOfModal}
                  titleModal={titleModal}
                  indexSelect={indexSelect}
                  dataModal={dataModal}
                  handleSelect={this.handleSelect}
                  toggleModal={this.toggleModal}
                />
              )
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  title: {
    fontSize: fontSize.f30,
    marginHorizontal: fontSize.f20,
    textAlign: "center",
    fontFamily: fonts.primaryBold,
    marginBottom: scale(15)
  },
  logo: {width: scale(220), height: scale(90), marginBottom: scale(25)},
  dropdownTitle: {fontSize: fontSize.f14, color: colors.darkBlueGray, opacity: 0.6},
  subTitle: {
    fontFamily: fonts.primaryBold,
    textAlign: "center",
    marginHorizontal: scale(30),
    marginBottom: fontSize.f35,
    opacity: 0.8
  },
  btnItem: {flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginVertical: width*0.02, width: width*0.55},
});

const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions)(Cars);
