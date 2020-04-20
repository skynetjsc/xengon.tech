import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image, Alert,
  Dimensions,
} from 'react-native';

import { connect } from "react-redux";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import * as actions from "../../modules/AppState"
import Toast from "react-native-tiny-toast";
import FastImage from 'react-native-fast-image';
import LottieView from 'lottie-react-native';

import styles from './styles';
import { format, colors, commonStyle, fontSize, fonts } from '../../styles';
import Assets from '../../../assets';

import InputInfo from '../../components/InputInfo';
import SelectInfo from '../../components/SelectInfo';
import InputPhone from '../../components/InputPhone';
import {HeaderDefault} from '../index';
import APIManager from '../../helpers/APIManager';
import { ButtonSelectInfo, ModalSelect, MultiplePlaceHolders, Text } from '../../components';

const {width} = Dimensions.get("window");

const title = {
  header: "Cập nhật hồ sơ",
  button: "CẬP NHẬT THÔNG TIN",
};

const validate = ["user_id","name", "email","car_brand_id", "car_type_id", "car_model_id", "car_number", "phone","is_noti"];

const validateTitle = {
  name: "Tên",
  car_brand_id: "Hãng xe",
  car_type_id: "Phân khúc",
  car_model_id: "Mẫu xe",
  phone: "Số điện thoại",
  email: "Email",
  car_number: "Biển số",
};

class EditProfileScreen extends Component {

  constructor() {
    super();
    this.state = {
      listBrand: [],
      listType: [],
      listModel: [],
      loadingAvatar: false,
      loadingPlaceHolder: true,
      statusOfModal: "off",
      dataUpdate : {
        user_id: null,
        name: "",
        car_brand_id: null,
        car_type_id: null,
        car_model_id: null,
        phone: "",
        email: "",
        car_number: "",
        is_noti: 1
      }
    }
  }

  componentDidMount(): void {
    this.initData();
    this.callCarBrandApi();
    this.callCarTypeApi();
    this.callCarModelApi();
    setTimeout(() => {
      this.setState({loadingPlaceHolder: false})
    },1000)
  }

  initData = () => {
    const {profile} = this.props.app;
    const {dataUpdate} = this.state;
    if (profile) {
      validate.map ((item, index) => {
        if (index === 0){
          dataUpdate.user_id = profile.id ? profile.id : ""
        } else {
          dataUpdate[item] = profile[item] ? profile[item] : ""
        }
      });

      this.setState({dataUpdate})
    }
  };

  onChangeText = (mode, text) => {
    const {dataUpdate} = this.state;
    dataUpdate[mode] = text;
    this.setState({dataUpdate});
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  openLibImage = () => {
    const options = {
      title: 'Chọn hình đại diện',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      noData: false,
      chooseFromLibraryButtonTitle: 'Choose From Library',
      cancelButtonTitle: 'Cancel'
    };
    ImagePicker.openPicker({
      width,
      height: width,
      cropping: true,
      cropperToolbarTitle: 'Chỉnh sửa ảnh',
      cropperCircleOverlay:true,
      mediaType:'photo',
      cropperChooseText:'Sử dụng ảnh',
      cropperCancelText:'Huỷ',

    }).then(image => {
      const fileSize = image.size/1000000;
      if (fileSize <= 2 && image.path) {
        this.updateAvatar(image);
        this.setState({loadingAvatar: true});
      } else {
        alert("Không thể upload hình, dung lượng tối đa của hình đại diện là 2MB, xin vui lòng chọn ảnh khác!!")
      }
      // console.log(image);
    })
      .catch(error => {

      });
    // ImagePicker.launchImageLibrary(options,(response)=>{
    //   // console.log(response.fileSize/1000000);
    //   const fileSize = response.fileSize/1000000;
    //   if (fileSize <= 2 && response.uri) {
    //     this.updateAvatar(response);
    //     this.setState({loadingAvatar: true});
    //   } else {
    //     alert("Không thể upload hình, dung lượng tối đa của hình đại diện là 2MB, xin vui lòng chọn ảnh khác!!")
    //   }
    //
    //
    // });
  };

  updateAvatar = (response) => {
    const {profile} = this.props.app;
    if (profile.id) {
      const bodyFormData = new FormData();
      const {path,fileName} = response;
      let imgName = fileName;
      if(!fileName){
        const getFilename = path.split("/");
        imgName = getFilename[getFilename.length - 1];
      }
      bodyFormData.append('user_id', profile.id);
      bodyFormData.append("img", {
        type: "image/jpeg",
        name: `avatar_user_${profile.id}_${imgName}`,
        uri:path
      });
      APIManager.getInstance().updateAvatar(bodyFormData)
        .then(res => {
          const avatar = res.data.data;
          // console.log(avatar);
          if (avatar) {
            profile.avatar = avatar;
            this.props.setProfile(profile);
            this.setState({loadingAvatar: false});
            Toast.show("Update hình đại diện thành công !");
          }
        })
        .catch(err => {
          //console.log(err);
          Toast.show("Đã xảy ra lỗi vui lòng thử lại!!");
        });
    }
  };

  submitUpdate = () => {
    const {dataUpdate} = this.state;
    for (let i = 0; i < validate.length; i ++) {
      const item = validate[i];
      const titleValidate = validateTitle[item];
      const value = dataUpdate[item].trim();
      // console.log(value);
      if (value === "") {
        Toast.show(`${titleValidate} không được để trống, vui lòng thử lại`);
        return;
      }
      if (item === "email" && !format.emailType.test(value)) {
        Toast.show(`${titleValidate} sai định dạng, vui lòng thử lại`);
        return;
      }
      if (item === "car_number" && !format.carNumber.test(value)) {
        Toast.show(`${titleValidate} sai định dạng, vui lòng thử lại`);
        return;
      }
      if (item !== "email" && item !== "car_number" && format.specialCharacter.test(value)) {
        Toast.show(`${titleValidate} sai định dạng, vui lòng thử lại`);
        return;
      }
      if (item === "phone" && value.length !== 10) {
        Toast.show("Số điện thoại phải có 10 ký tự, vui lòng thử lại");
        return;
      }
    }

    this.updateProfile(dataUpdate);
  };

  updateProfile = (profile) => {
    if (profile.user_id) {
      const bodyFormData = new FormData();
      validate.map((item) => bodyFormData.append(item,profile[item].trim()));
      // console.log(bodyFormData);
      APIManager.getInstance().updateProfile(bodyFormData)
        .then(res => {
          const {errorId,message,data} = res.data;
          if (data) {
            this.props.setProfile(data);
            Alert.alert(
              "Thông báo",
              "Cập nhật thông tin cá nhân thành công!!",
              [{text: "OK",onPress: this.onPressBack}]);
            // this.onPressBack();
          } else if (errorId === 404){
            alert(message);
          }
        })
        .catch(err => {
          //console.log(err);
          alert("Đã xảy ra lỗi vui lòng thử lại!!");
        });
    }
  };

  callCarBrandApi = () => {
    APIManager.getInstance().carBrand()
      .then(res => {
        // console.log(res);
        const listBrand = res.data.data;
        if (listBrand && listBrand.length > 0) {
          this.setState({listBrand});
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
        if (listType && listType.length > 0){
          this.setState({listType});
        }
      })
      .catch(err => {
        //console.log(err);
      });
  };

  callCarModelApi = () => {
    const {dataUpdate} = this.state;
    const {car_brand_id,car_type_id,car_model_id} = dataUpdate;
    APIManager.getInstance().carModel(car_brand_id,car_type_id)
      .then(res => {
        const listModel = res.data.data;
        // console.log(listModel);
        // check carmodelid có trong listmodel không, nếu ko có thì lấy id thằng đầu tiên
        if (listModel && listModel.length > 0) {
          const index = listModel.findIndex((item) => item.id === car_model_id);
          if (index >= 0) {
            dataUpdate.car_model_id = car_model_id;
          } else {
            dataUpdate.car_model_id = listModel[0].id;
          }
          this.setState({listModel,dataUpdate})
        } else {
          dataUpdate.car_model_id = "";
          this.setState({listModel: [],dataUpdate})
        }
      })
      .catch(err => {
        //console.log(err);
        dataUpdate.car_model_id = "";
        this.setState({listModel: [],dataUpdate})
      });
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

  toggleModal = (mode) => this.setState({statusOfModal: mode});

  render() {
    const {dataUpdate,listBrand,listType,listModel,loadingPlaceHolder,loadingAvatar,statusOfModal} = this.state;
    const {profile} = this.props.app;
    const avatar = profile ? profile.avatar : "";
    const name = dataUpdate.name ? dataUpdate.name : "";
    const email = dataUpdate.email ? dataUpdate.email : "";
    const phone = dataUpdate.phone ? dataUpdate.phone : "";
    const car_number = dataUpdate.car_number ? dataUpdate.car_number : "";
    const carBrandName = this.getNameCar(listBrand,dataUpdate.car_brand_id);
    const carTypeName = this.getNameCar(listType,dataUpdate.car_type_id);
    const carModelName = this.getNameCar(listModel,dataUpdate.car_model_id);
    const indexSelect =  this.findIndexSelected();
    const titleModal = statusOfModal === "car_brand_id" ? "Chọn hãng xe" : statusOfModal === "car_type_id" ? "Chọn phân khúc xe" : "Chọn mẫu xe";
    const dataModal = statusOfModal === "car_brand_id" ? listBrand : statusOfModal === "car_type_id" ? listType : statusOfModal === "car_model_id" ? listModel : [];

    return (
      <View style={{flex:1, backgroundColor:'#F3F5F9'}}>
        <HeaderDefault
          title={title.header}
          onPressBack={this.onPressBack}
        />
        {
          loadingPlaceHolder ? (
            <View>
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
            </View>
          ) : (
            <View style={{flex: 1}}>
              <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
                extraScrollHeight={15}
              >
                <View style={styles.content}>
                  <View style={styles.avatarContent}>
                    <TouchableOpacity
                      style={styles.avatarWrapper}
                      activeOpacity={0.7}
                      onPress={this.openLibImage}
                    >
                      {
                        loadingAvatar ? (
                          <LottieView source={require('../../../assets/3532-car.json')} autoPlay loop />
                        ) : avatar !== "" ?
                          <FastImage source={{uri: avatar}} style={styles.avatar} />
                          : <Image source={Assets.ic_avatar} style={styles.avatar} />
                      }
                    </TouchableOpacity>

                    <Text style={styles.textAvatar}>Bấm vào ảnh để cập nhật</Text>
                  </View>

                  <View style={styles.editUserInfo}>
                    <InputInfo
                      placeholder="Tên anh chị"
                      value={name}
                      onChangeText={(text) => this.onChangeText("name",text)}
                      style={{fontFamily: fonts.primaryRegular}}
                    />
                    <InputInfo style={{fontFamily: fonts.primaryRegular}} autoCapitalize='none' placeholder="Email" keyboardType="email-address" value={email} onChangeText={(text) => this.onChangeText("email",text)} />
                    <ButtonSelectInfo styleText={{fontFamily: fonts.primaryRegular}} title="Hãng xe" content={carBrandName} onPress={() => this.toggleModal("car_brand_id")} />
                    <ButtonSelectInfo title="Phân khúc" content={carTypeName} onPress={() => this.toggleModal("car_type_id")} />
                    <ButtonSelectInfo title="Mẫu xe" content={carModelName} onPress={() => this.toggleModal("car_model_id")} />
                    <InputInfo style={{fontFamily: fonts.primaryRegular}} placeholder="Biển số xe" value={car_number} onChangeText={(text) => this.onChangeText("car_number",text)} />
                    <InputPhone styleText={{fontFamily: fonts.primaryRegular}} placeholder="Số điện thoại" keyboardType="number-pad" value={phone} onChangeText={(text) => this.onChangeText("phone",text)} />
                  </View>
                </View>
                <TouchableOpacity style={styles.btnUpdateInfo} onPress={this.submitUpdate}>
                  <Text style={styles.textUpdateInfo} numberOfLines={1}>
                    {title.button}
                  </Text>
                </TouchableOpacity>
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
              </KeyboardAwareScrollView>
            </View>
          )
        }
      </View>
    );
  }
}

const mapStateToPros = state => ({
  app: state.app
});
export default connect(mapStateToPros,actions)(EditProfileScreen);
