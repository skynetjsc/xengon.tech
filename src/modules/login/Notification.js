import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image, Platform, PermissionsAndroid, AsyncStorage
} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

import { colors, fonts, commonStyle, fontSize} from '../../styles';
import { IconNext, IconNotification } from '../../styles/svg';

import { ButtonFrame } from '../../components';
import { connect } from 'react-redux';
import * as actions from '../AppState';
import NotificationManager from "../../helpers/NotificationManager";
import { scale } from 'react-native-size-matters';


const { width } = Dimensions.get('window');

const title = {
  h1: "Vị trí & thông báo",
  sub: "Cho phép xe ngon gửi thông báo & vị trí khi anh/chị đặt dịch vụ trên ứng dụng tại bất cứ đâu mà anh chị muốn.",
  btnAcc: "CHO PHÉP",
  btnCancel: "BỎ QUA"
};

class Notification extends React.Component {

  onRequestPermission = async () => {
    const {profile} = this.props.app;
    if (profile.hasOwnProperty("id")) {
      await this.requestPermissionLocation();
      await NotificationManager.getInstance().checkPermission(profile.id);
      this.props.navigation.navigate("Main");
    }
  };

  requestPermissionLocation = async () => {
    if (Platform.OS === 'ios') {
      await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

  };

  Cancel = () => {
    this.props.navigation.navigate("Main");
    const {profile} = this.props.app;
    if (profile) {
      NotificationManager.getInstance().updateNotification(profile.id, 0);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {/*<IconMails width={width*0.45} height={width*0.45} style={styles.mails}/>*/}
        {/*<Image source={require('../../../assets/images/local-notifications.png')} style={styles.mails} />*/}

        <IconNotification />

        <Text style={[commonStyle.h1,{fontSize: fontSize.f30, marginTop: scale(40)}]}>{title.h1}</Text>

        <Text style={[commonStyle.h3,styles.subTitle]}>{title.sub}</Text>

        <ButtonFrame
          title={title.btnAcc}
          onPress={this.onRequestPermission}
          image={<IconNext />}
          style={{width: 250}}
        />

        <TouchableOpacity
          onPress={this.Cancel}
        >
          <Text style={[commonStyle.h4,styles.btnCancel]}>{title.btnCancel}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.defaultBackgroundColor
  },
  mails: {
    marginTop: fontSize.f20,
    marginBottom: width*0.24,
    // height: width*0.45,
    // width: width*0.45
  },
  subTitle: {fontFamily: fonts.primarySemiBold, textAlign: "center", marginHorizontal: width*(35/375), marginBottom: fontSize.f35},
  btnCancel: {opacity: 0.4, height: 50, marginTop: fontSize.f35,paddingHorizontal: 20},
});

const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions) (Notification)
