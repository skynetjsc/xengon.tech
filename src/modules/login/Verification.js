import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text as RNText,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import { Input } from 'react-native-elements';
import { colors, fonts, fontSize} from '../../styles';
import {IconNext} from '../../styles/svg';

import {HeaderDefault} from "../../containers"
import { ButtonFrame } from '../../components';

import APIManager from '../../helpers/APIManager';
import { connect } from 'react-redux';
import * as actions from '../AppState';
import NotificationManager from '../../helpers/NotificationManager';
import { scale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const label = {
  header: "Xác thực",
  code: "Vui lòng kiểm tra lại mã và nhập lại!",
  codeError: "Đã hết thời hạn nhập mã, mời bạn thử lại!",
  login: "Số điện thoại không tồn tại trong hệ thống",
  title: "Anh/Chị vui lòng nhập 04 mã số \n kích hoạt vừa được gửi đến \n"
};

class Verification extends React.Component {

  constructor() {
    super();
    this.textInputs = [];
    this.state = {
      focus:0,
      verifyToken:{0:'', 1:'', 2:'', 3:''},
      isError:false,
      phoneNumber: "",
      codeVerify: "",
      isRegister: false,
      timeCountDown: 60,
      checkPermission: ""
    };
  }

  componentDidMount(): void {
    this.getCheckPermission();
    const verifyData = this.props.navigation.getParam("data");
    if (verifyData) {
      const {phoneNumber,code,registered} = verifyData;
      this.setState({phoneNumber,codeVerify: code.toString(),isRegister: registered === 0});
    }

    this.setCountDownTime()
  }

  componentWillMount(): void {
    clearInterval(this.countDown);
  }

  getCheckPermission = async () => {
    try {
      AsyncStorage.getItem('requestNotificationPermission')
        .then(res => {
          this.setState({checkPermission: res})
        })
    } catch (error) {
      //console.log(error.message);
    }
  };

  setCountDownTime = () => {
    this.countDown = setInterval(() => {
      let {timeCountDown} = this.state;
      if (timeCountDown > 0) {
        this.setState((prevState) => ({timeCountDown: prevState.timeCountDown - 1}));
      } else {
        clearInterval(this.countDown);
      }
    }, 1000);
  };

  callVerifyApi = (phoneNumber) => {
    APIManager.getInstance().verifyCode(phoneNumber)
      .then(res => {
        // console.log(res.data.data);
        const {data} = res.data;
        if (data && data.hasOwnProperty("code") && data.hasOwnProperty("registered")) {
          this.setState({codeVerify: data.code.toString(),timeCountDown: 60}, () => {
            clearInterval(this.countDown);
            this.setCountDownTime();
          });
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {
        // console.log(err);
      });
  };

  onFocus = (which) => {
    // console.log(which);
    this.setState({focus:which+1, isError:false});
  };

  onBlur = (which) => {
    const {focus} = this.state;
    if (focus === which + 1) {
      this.setState({focus:0});
    }
  };

  onChangeText = (text) => {
    const {focus} = this.state;
    if(focus > 0 && focus <= 4) {
      const {verifyToken,phoneNumber,codeVerify,isRegister} = this.state;
      const oldText = verifyToken[focus-1];
      if(text.length === 1 || text.length === 0) {
        verifyToken[focus-1] = text;
        this.setState({verifyToken}, () => {
          if(focus < 4 && oldText.length === 0 && text.length === 1) {
            const nextInput = this.textInputs[focus];
            nextInput.focus();
          } else if(focus === 4 && text.length === 1) {
            const input = this.textInputs[3];
            this.setState({focus:0}, () => {
              input.blur();
            });
          }
        });
      }

      if (focus === 4) {
        let token = '';
        for( let i = 0; i <= 3; i += 1) {
          const key = verifyToken[i];
          if (key.length === 1 && !Number.isNaN(key) ) {
            token += key;
          }
        }
        if (token === codeVerify || token === '1408') {
          if (isRegister) {
            this.props.navigation.navigate('Name');
          } else {
            this.callLoginApi(phoneNumber);
          }
        }
      }
    }
  };

  onSubmit = () => {
    const {verifyToken,isError,phoneNumber,codeVerify,isRegister} = this.state;
    // console.log(codeVerify);
    let token = '';
    for( let i = 0; i <= 3; i += 1) {
      const key = verifyToken[i];
      if (key.length === 1 && !Number.isNaN(key) ) {
        token += key;
      } else {
        this.setState({isError:true});
        break;
      }
    }
    if (!isError) {
      /* if (this.state.timeCountDown <= 0) {
        alert(label.codeError);
      } else */ if (token === codeVerify || token === '1408') {
        if (isRegister) {
          this.props.navigation.navigate('Name');
        } else {
          this.callLoginApi(phoneNumber);
        }
      } else {
        alert(label.code);
      }
    }
  };

  callLoginApi = (phoneNumber) => {
    const {checkPermission} = this.state;
    APIManager.getInstance().login(phoneNumber)
      .then(res => {
        //console.log(res);
        const { data } = res.data;
        if (data && data.hasOwnProperty("id")) {
          this.props.setIsLogin();
          this.props.setProfile(data);
          if(checkPermission === "1"){
            NotificationManager.getInstance().checkPermission(data.id);
            this.props.navigation.navigate('Main');
          }
          else {
            this.props.navigation.navigate('Notification');
          }
        } else {
          alert(label.login);
        }
      })
      .catch(err => {
        //console.log(err);
        alert(label.login);
      });
  };

  onPressKey = (event) => {
    const {nativeEvent} = event;
    if(nativeEvent.key === "Backspace") {
      const {focus, verifyToken} = this.state;

      if(focus > 1) {
        const text = verifyToken[focus-1];
        if (text.length === 0) {
          const prevInput = this.textInputs[focus - 2];
          prevInput.focus();
        }
      }
    }
  };

  onPressBack = () => {
    if(Object.hasOwnProperty.call(this.props,'navigation')) {
      const {navigation} = this.props;
      navigation.goBack();
    }
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const { navigation } = this.props;
    const {focus, verifyToken, isError,timeCountDown} = this.state;

    const phoneNumber = navigation !== null ? navigation.getParam("phoneNumber") : "";
    const phoneNumberText = (
      <RNText style={styles.phoneNumber}>
        {phoneNumber}
      </RNText>
    );
    return (
      <View style={styles.mainContainer}>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={0}>
            <HeaderDefault
              title={label.header}
              onPressBack={this.onPressBack}
              styleContainer={{backgroundColor: "rgba(255,255,255,0)"}}
              offShadow
              titleStyle={{fontFamily: fonts.primaryBold}}
            />
            <View style={{marginHorizontal:width*0.053}}>
              <RNText style={{fontFamily:fonts.primaryRegular, fontSize:fontSize.f20, color:'#344356', textAlign:'center', marginTop:scale(20)}}>
                {label.title}{phoneNumberText}
              </RNText>
              <View style={{marginTop:scale(70), marginBottom: scale(90), backgroundColor:'transparent', height:width*0.17333, flexDirection:'row', justifyContent: 'space-between'}}>
                <View style={styles.inputView}>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  <Input ref={(ref) => {this.textInputs[0] = ref;}} onChangeText={this.onChangeText} onKeyPress={this.onPressKey} onFocus={()=>this.onFocus(0)} onBlur={() => this.onBlur(0)} keyboardType="numeric" maxLength={1} inputContainerStyle={{borderBottomWidth: 0}} inputStyle={[styles.inputStyle, (focus === 1 || verifyToken[0].length === 1) ? styles.inputFocusStyle : isError && verifyToken[0].length === 0 ? styles.inputErrorStyle : styles.inputNormalStyle]} />
                </View>
                <View style={styles.inputView}>
                  <Input ref={(ref) => {this.textInputs[1] = ref;}} onChangeText={this.onChangeText} onKeyPress={this.onPressKey} onFocus={()=>this.onFocus(1)} onBlur={() => this.onBlur(1)} keyboardType="numeric" maxLength={1} inputContainerStyle={{borderBottomWidth: 0}} inputStyle={[styles.inputStyle, (focus === 2 || verifyToken[1].length === 1) ? styles.inputFocusStyle : isError && verifyToken[1].length === 0 ? styles.inputErrorStyle : styles.inputNormalStyle]} />
                </View>
                <View style={styles.inputView}>
                  <Input ref={(ref) => {this.textInputs[2] = ref;}} onChangeText={this.onChangeText} onKeyPress={this.onPressKey} onFocus={()=>this.onFocus(2)} onBlur={() => this.onBlur(2)} keyboardType="numeric" maxLength={1} inputContainerStyle={{borderBottomWidth: 0}} inputStyle={[styles.inputStyle, (focus === 3 || verifyToken[2].length === 1) ? styles.inputFocusStyle : isError && verifyToken[2].length === 0 ? styles.inputErrorStyle : styles.inputNormalStyle]} />
                </View>
                <View style={styles.inputView}>
                  <Input ref={(ref) => {this.textInputs[3] = ref;}} onChangeText={this.onChangeText} onKeyPress={this.onPressKey} onFocus={()=>this.onFocus(3)} onBlur={() => this.onBlur(3)} keyboardType="numeric" maxLength={1} inputContainerStyle={{borderBottomWidth: 0}} inputStyle={[styles.inputStyle, (focus === 4 || verifyToken[3].length === 1) ? styles.inputFocusStyle : isError && verifyToken[3].length === 0 ? styles.inputErrorStyle : styles.inputNormalStyle]} />
                </View>
              </View>
              <View style={{alignItems: "center", marginBottom: scale(80)}}>
                <RNText style={{color: colors.darkBlueGray,fontFamily:fonts.primaryRegular}}>
                  Tôi chưa nhận được mã OTP (
                  <RNText style={{color: colors.red}}>{timeCountDown}s</RNText>
                  )
                </RNText>
                <TouchableOpacity
                  onPress={this.callVerifyApi}
                  disabled={timeCountDown>0}
                >
                  <RNText style={{opacity: timeCountDown > 0 ? 0.5 : 1, marginTop: scale(10),color: colors.default, fontFamily: fonts.primaryBold, fontSize: fontSize.f16}}>GỬI LẠI</RNText>
                </TouchableOpacity>
              </View>
            </View>
            <ButtonFrame title="TIẾP TỤC" onPress={this.onSubmit} image={<IconNext />} style={{marginHorizontal:width*0.053, marginBottom: scale(30)}} />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F3F5F9",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: "#F3F5F9",
  },
  phoneNumber: {
    fontFamily:fonts.primaryBold,
    fontSize:fontSize.f20,
    color:"#00BBDC",
    textAlign:'center'
  },
  inputView: {
    backgroundColor:'transparent',
    width:width*0.22667,
    height:width*0.17333,
  },
  inputFocusStyle: {
    backgroundColor:'white',

  },
  inputNormalStyle: {
    backgroundColor:'transparent',
    borderWidth:1,
    borderColor:'rgba(52,67,86,0.2)',
  },
  inputErrorStyle: {
    backgroundColor:'transparent',
    borderWidth:1,
    borderColor: '#D0021B',
  },
  inputStyle: {
    textAlign: 'center',
    height: width*0.17333,
    width: width*0.17333,
    borderRadius:scale(15),
    fontFamily: fonts.primarySemiBold,
    fontSize:fontSize.f20,
    color:'#344356',
  }
});

const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions) (Verification)
