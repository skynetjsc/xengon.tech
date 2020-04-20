import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text as RNText,
  ScrollView,
  KeyboardAvoidingView, Image,
} from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../AppState';

import { colors, fonts, fontSize } from '../../styles';
import {IconNext, IconVietNam, IconLogo} from '../../styles/svg';

import {HeaderDefault} from "../../containers"
import { ButtonFrame, ViewShadow } from '../../components';
import APIManager from "../../helpers/APIManager";
import { scale  } from 'react-native-size-matters';
import Assets from '../../../assets';

const { width } = Dimensions.get('window');

const label = {
  header: "Chào Mừng Bạn",
  validatePhone: "Vui lòng kiểm tra lại, số điện thoại phải có 10 ký tự!!",
  titleBtn: "TIẾP TỤC",
  titleLogin: "Đăng nhập",
  title: "Anh chị vui lòng nhập số điện thoại để sử dụng dịch vụ"
};

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      notFirstLaunch: false,
      isDisable: false
    };
  }

  componentDidMount(): void {
    this.props.setParamsRegister(null);
    const {notFirstLaunch} = this.props;
    if (notFirstLaunch) {
      this.setState({notFirstLaunch})
    } else {
      const {isFirstOpen} = this.props.app;
      if (!isFirstOpen) this.setState({notFirstLaunch: true});
    }
  }

  onChangeText = (text) => {
    this.setState({phoneNumber:text});
  };

  onPressBack = () => {
    if(Object.hasOwnProperty.call(this.props,'navigation')) {
      const {navigation} = this.props;
      navigation.goBack();
    }
  };

  onPressNext = () => {
    const {phoneNumber} = this.state;
    if(phoneNumber && phoneNumber.length === 10) {
      this.setState({isDisable: true});
      this.callVerifyApi(phoneNumber);
    } else {
      alert(label.validatePhone);
    }
  };

  callVerifyApi = (phoneNumber) => {
    APIManager.getInstance().verifyCode(phoneNumber)
      .then(res => {
        //console.log(res.data.data);
        const {data} = res.data;
        const params = { phone: phoneNumber };
        if (data && data.hasOwnProperty("code") && data.hasOwnProperty("registered")) {
          data.phoneNumber = phoneNumber;
          this.props.navigation.navigate('Verification', {data});
          if (data.registered === 0) this.props.setParamsRegister(params);
        }
        this.setState({isDisable: false});
      })
      .catch(err => {
        //console.log(err);
        this.setState({isDisable: false});
      });
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={10}>
            <IconLogo style={{marginVertical: 30, alignSelf: 'center'}} />
            <RNText style={styles.titleLogin}>
              {label.titleLogin}
            </RNText>
            <RNText style={styles.title}>
              {label.title}
            </RNText>
            <ViewShadow style={styles.viewShadow}>
              <IconVietNam />
              <View style={{width: 1, height: 26, backgroundColor: colors.lightGray, marginLeft: 13}} />
              <View style={{flex: 1}}>
                <Input
                  ref={(ref) => {this.textInput = ref;}}
                  onChangeText={this.onChangeText}
                  placeholder='Nhập số điện thoại'
                  inputContainerStyle={{borderBottomWidth: 0}}
                  inputStyle={styles.inputStyle}
                  keyboardType="number-pad"
                />
              </View>
            </ViewShadow>
            <ButtonFrame disabled={this.state.isDisable} title={label.titleBtn} onPress={this.onPressNext} image={<IconNext />} style={{marginHorizontal:width*0.053, marginBottom: 30}}/>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  };

}

const styles = StyleSheet.create({
  viewShadow: {flexDirection: "row", alignItems: "center", marginTop:40, marginBottom: scale(80), marginHorizontal:width*0.053, paddingHorizontal: scale(12)},
  mainContainer: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: "#F3F5F9",
    paddingTop: scale(80)
  },
  titleLogin: {
    fontFamily:fonts.primaryBold,
    fontSize:fontSize.f26,
    color: colors.defaultBgButton,
    textAlign:'center',
    marginTop:scale(30)
  },
  title: {
    fontFamily:fonts.primaryRegular,
    fontSize: fontSize.f20,
    color:'#344356',
    textAlign:'center',
    alignSelf: "center",
    marginTop:15,
    maxWidth: scale(290)
  },
  inputStyle: {
    backgroundColor:'white',
    height:scale(60),
    fontFamily: fonts.primaryRegular,
    fontSize:20,
    color:'#344356',
    marginLeft: 5,
    flex: 1
  }
});

const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions) (Login)
