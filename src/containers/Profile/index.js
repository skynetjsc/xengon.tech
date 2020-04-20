import React, {Component, useState, useCallback} from 'react';
import { View, Text, TouchableOpacity, Image, Switch, Alert, Linking } from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import { NavigationActions, StackActions } from 'react-navigation';
import FastImage from 'react-native-fast-image';

import { connect } from "react-redux";
import * as actions from "../../modules/AppState";
import APIManager from '../../helpers/APIManager';

import styles from './styles';
import Assets from '../../../assets';
import InfoItem from '../../components/InfoItem';
import UserInfo from '../../components/UserInfo';
import { ButtonNotification } from '../index';
import {MultiplePlaceHolders} from '../../components';
import fonts from '../../styles/fonts';
import NotificationManager from '../../helpers/NotificationManager';

const STATE_HOME = {
  profile: 'profile',
  qrCode: 'qrCode',
  support: 'support',
};

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Login'})],
});

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: true,
      currentState: STATE_HOME.profile,
      carModel: "",
      loadingPlaceHolder: false,
      config: null,
    };

    this.willFocusProfile = props.navigation.addListener(
      'willFocus',
      payload => {
        this.callCarModelApi();
        this.getNotifications();
      }
    );
  }

  componentDidMount(): void {
    const {profile} = this.props.app;
    if (profile) {
      this.getInfo(profile.id);
    }
    // this.callCarModelApi();
    // setTimeout(() => {
    //   this.setState({loadingPlaceHolder: false})
    // },1500);
    this.getConfig();
  }

  componentWillUnmount(): void {
    if(Object.hasOwnProperty.call(this,'willFocusProfile') &&
      Object.hasOwnProperty.call(this.willFocusProfile, 'remove')) {
      this.willFocusProfile.remove();
    }
  }

  getConfig = async () => {
    APIManager.getInstance().getConfigs()
      .then(res => {
        const {data} = res.data;
        if(data){
          this.setState({
            config: data,
          });
        }
      })
  };

  goEditInfo = () => {
    const {navigation} = this.props;
    navigation.navigate('EditProfile');
  };

  goTermPrivacy = () => {
    const {navigation} = this.props;
    navigation.navigate('Terms');
  };

  goToSupport = () => {
    const {navigation} = this.props;
    navigation.navigate('Support');
  };

  getInfo = (userId) => {
    this.setState({loadingPlaceHolder: true});
    APIManager.getInstance().getInfo(userId)
      .then(res => {
        const {data} = res.data;
        if (data) {
          this.props.setProfile(data);
          this.setState({loadingPlaceHolder: false});
        }
      })
      .catch((error) => {
        //console.log(error);
      })
  };

  onCall = () => {
    const {config} = this.state;
    const phone = config && config.hasOwnProperty('phone')? config.phone : null;
    //console.log("phone: ", phone);
    const url = `tel://${phone}`;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        // console.log(`Can't handle url: ${  url}`);
        alert("Không thể thực hiện cuộc gọi này.")
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => {/*console.error('An error occurred', err)*/});
  };

  styleTextSelect = state => {
    const {currentState} = this.state;
    if (currentState === state) {
      return {
        fontFamily: fonts.primaryExtraBold,
        color: '#00d2e9',
      };
    }

    return {};
  };

  changeCurrentState = state => {
    this.setState({currentState: state});
  };

  getNotifications = () => {
    const {profile} = this.props.app;
    this.props.getNotification(profile.id);
  };

  callCarModelApi = () => {
    if (this.props.app.profile) {
      let {car_brand_id,car_type_id,car_model_id} = this.props.app.profile;
      APIManager.getInstance().carModel(car_brand_id,car_type_id)
        .then(res => {
          // console.log(res);
          const listModel = res.data.data;
          listModel.map((item) => {
            if (item.id === car_model_id) {
              this.setState({carModel: item.name})
            }
          });
        })
        .catch(err => {
          //console.log(err);
        });
    }
  };

  updateStatusNotification = () => {
    const {profile} = this.props.app;
    if (profile) {
      const {id,is_noti} = profile;
      NotificationManager.getInstance().updateNotification(id, is_noti === "1" ? 0 : 1);
      profile.is_noti = is_noti === "1" ? "0" : "1";
      this.props.setProfile(profile);
    }
  };

  renderProfile = (profile) => {
    const {toggle,carModel} = this.state;
    const name = profile.hasOwnProperty("name") ? profile.name : "Mr. Porsche";
    const email = profile.hasOwnProperty("email") && profile.email !== "" ? profile.email : "Thêm email";
    const phone = profile.hasOwnProperty("phone") ? profile.phone : "Thêm số điện thoại";
    const car_number = profile.hasOwnProperty("car_number") && profile.car_number ? profile.car_number : "Thêm biển số";

    return (
      <React.Fragment>
        <View style={styles.infoWrapper}>
          <InfoItem
            onPress={this.goEditInfo}
            leftImg={Assets.ic_user}
            title={name}
            subTitle="Tên anh/chị"
          />

          <InfoItem
            onPress={this.goEditInfo}
            leftImg={Assets.ic_email}
            title={email}
            subTitle="email@email.com"
          />

          <InfoItem
            onPress={this.goEditInfo}
            leftImg={Assets.ic_car}
            title={car_number}
            subTitle={carModel}
          />

          <InfoItem
            onPress={this.goEditInfo}
            leftImg={Assets.ic_phone}
            title={phone}
            subTitle="Điện thoại"
          />
        </View>
        <View style={styles.notifiWrapper}>
          <Image source={Assets.ic_notifi} style={styles.imgLeftNotifi} />

          <View style={styles.centerNotifi}>
            <Text style={styles.centerText} numberOfLines={1}>
              Nhận thông báo
            </Text>
          </View>

          <Switch
            value={profile.is_noti === "1"}
            thumbColor="#344356"
            ios_backgroundColor="transparent"
            trackColor={{false: 'lightgrey', true: '#00d2e9'}}
            onValueChange={this.updateStatusNotification}
          />
        </View>
        <TouchableOpacity
          style={styles.logoutWrapper}
          onPress={this.logout}
        >
          <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
        </TouchableOpacity>

      </React.Fragment>
    );
  };

  renderQrCode = (profile) => {
    const qr_code = profile.hasOwnProperty("qr_code") ? profile.qr_code : null;
    return (
      <View style={styles.qrCodeWrapper}>
        {
          qr_code ?
            <FastImage source={{uri :qr_code}} style={styles.imageQrCode} />
            : <Image source={Assets.ic_bigQrCode} style={styles.imageQrCode} />
        }

        <Text style={styles.textQr}>
          Mã QR code để tra cứu thông tin cá nhân
        </Text>
      </View>
    )
  };

  renderSupport = () => (
    <View style={styles.infoWrapper}>
      <InfoItem
        onPress={this.onCall}
        leftImg={Assets.ic_help}
        title="Trung tâm hỗ trợ"
        subTitle="Giải đáp thắc mắc 24/7 "
      />

      <InfoItem
        onPress={this.goTermPrivacy}
        leftImg={Assets.ic_privacy}
        title="Chính sách & Điều khoản"
        subTitle="Tìm hiểu về chính sách"
      />

      <InfoItem
        onPress={this.goToSupport}
        leftImg={Assets.ic_contact}
        title="Liên hệ "
        subTitle="Hỗ trợ dịch vụ"
      />
    </View>
    );

  goNotification = () => {
    this.props.navigation.navigate('Notifications');
  };

  renderBottom = (profile) => {
    const {currentState} = this.state;
    if (currentState === STATE_HOME.profile) {
      return this.renderProfile(profile);
    } if (currentState === STATE_HOME.qrCode) {
      return this.renderQrCode(profile);
    } if (currentState === STATE_HOME.support) {
      return this.renderSupport();
    }
  };

  logout = () => {
    const {profile} = this.props.app;
    APIManager.getInstance().sendPrivateLog('logout',{profile});
    this.props.navigation.dispatch(resetAction);
    this.props.resetAppState();
  };

  render() {
    const {profile} = this.props.app;
    const {loadingPlaceHolder} = this.state;
    const {data} = this.props.notifications;
    const countNotify = data ? data.unread.length : 0;
    return (
      <View style={{flex:1, backgroundColor:'#F3F5F9'}}>

        {
          loadingPlaceHolder ? (
            <View style={{marginTop: 50}}>
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
            </View>
            ) : (
              <View style={{flex: 1}}>
                <View style={{paddingHorizontal: scale(30)}}>
                  {
                    profile ? <UserInfo profile={profile} onPressAvavtar={this.goEditInfo} /> : null
                  }
                  <View style={styles.btnGroup}>
                    <TouchableOpacity
                      style={styles.btnWrapper}
                      onPress={() => this.changeCurrentState(STATE_HOME.profile)}
                    >
                      <Text
                        style={[
                          styles.txtBtn,
                          this.styleTextSelect(STATE_HOME.profile),
                        ]}
                      >
                        HỒ SƠ
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnWrapperCenter}
                      onPress={() => this.changeCurrentState(STATE_HOME.qrCode)}
                    >
                      <Text
                        style={[
                          styles.txtBtn,
                          this.styleTextSelect(STATE_HOME.qrCode),
                        ]}
                      >
                        MÃ QRCODE
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnWrapper}
                      onPress={() => this.changeCurrentState(STATE_HOME.support)}
                    >
                      <Text
                        style={[
                          styles.txtBtn,
                          this.styleTextSelect(STATE_HOME.support),
                        ]}
                      >
                        HỖ TRỢ
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  contentContainerStyle={styles.container}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  <View style={styles.content}>
                    <View style={{ height: 40, backgroundColor: 'transparent' }} />
                    {
                      profile ? this.renderBottom(profile) : null
                    }
                  </View>
                </ScrollView>
              </View>
            )
        }
        <ButtonNotification
          // countNotify={3}
          countNotify={countNotify}
          onPress={this.goNotification}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  app: state.app,
  notifications: state.NotificationReducer
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/NotificationRedux");
  const {setProfile, resetAppState} = require("../../modules/AppState");
  return {
    ...ownProps,
    ...stateProps,
    getNotification: (userId) => actions.getApiNotification(dispatch,userId),
    setProfile: (profile) => dispatch(setProfile(profile)),
    resetAppState: () => dispatch(resetAppState())
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ProfileScreen);

