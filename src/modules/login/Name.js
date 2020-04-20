import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text as RNText,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Input } from 'react-native-elements';
import Toast from "react-native-tiny-toast";

import { colors, fonts,format, fontSize} from '../../styles';
import {IconNext} from '../../styles/svg';

import {HeaderDefault} from "../../containers"
import { ButtonFrame, ViewShadow } from '../../components';

import { connect } from 'react-redux';
import * as actions from '../AppState';
import { scale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const title = {
  header: "Cập nhật thông tin",
  button: "TIẾP TỤC",
  placeholder: "Mời nhập họ tên",
  desc: "Anh/Chị hãy cho chúng em"+"\n"+"xin tên để tiện xưng hô ạ!",
  errorSpace: "Tên không được để trống. Vui lòng thử lại!",
  errorSpecialCharacter: "Tên sai định dạng. Vui lòng thử lại!"
};

class Name extends React.Component {

  constructor() {
    super();
    this.state = {name: ""};
  }

  onChangeText = (text) => {
    this.setState({name:text});
  };

  onPressNext = () => {
    const name = this.state.name.trim();
    if (name.length === 0) {
      Toast.show(title.errorSpace)
    } else if (format.specialCharacter.test(name)) {
      Toast.show(title.errorSpecialCharacter)
    } else if(name.length > 0) {
      if (Object.hasOwnProperty.call(this.props, 'navigation')) {
        const { navigation,app } = this.props;
        const {paramsRegister} = app;
        paramsRegister.name = name;
        this.props.setParamsRegister(paramsRegister);
        navigation.navigate('Cars',{name});
      }
    }
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <View style={styles.mainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView style={styles.container} behavior="position" keyboardVerticalOffset={-10}>
            <HeaderDefault
              title={title.header}
              isHideBackButton
              titleStyle={{fontFamily: fonts.primaryBold, fontSize: fontSize.f20}}
              styleContainer={{backgroundColor: "rgba(255,255,255,0)"}}
              offShadow
            />
            <RNText style={styles.title}>
              {title.desc}
            </RNText>
            <ViewShadow style={styles.viewShadow}>
              <Input
                ref={(ref) => {this.textInput = ref;}}
                onChangeText={this.onChangeText}
                placeholder={title.placeholder}
                inputContainerStyle={{borderBottomWidth: 0}}
                inputStyle={styles.inputStyle}
              />
            </ViewShadow>
            <ButtonFrame
              title={title.button} onPress={this.onPressNext} image={<IconNext />} style={{marginHorizontal:width*0.053}}
            />
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
  title: {
    fontFamily:fonts.primarySemiBold,
    fontSize:20,
    color:'#344356',
    textAlign:'center',
    marginTop:20,
    opacity: 0.8
  },
  viewShadow: {marginTop:70, marginBottom: 180, marginHorizontal:width*0.053, paddingHorizontal: scale(10)},
  inputStyle: {
    backgroundColor:'white',
    height:70,
    borderRadius:15,
    fontFamily: fonts.primaryBold,
    fontSize:20,
    color:'#344356',
  }
});

const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions) (Name)
