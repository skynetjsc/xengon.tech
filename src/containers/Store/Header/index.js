import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TextInput,
  Platform
} from 'react-native';

import { colors, fonts, fontSize } from '../../../styles';
import {IconCart} from '../../../styles/svg';
import { TextInputFrame, ViewShadow } from '../../../components';

const {height, width} = Dimensions.get('screen');

const textTitle = {
  store: 'CỬA HÀNG ',
  selfCare: 'TỰ CHĂM SÓC',
  content: 'Cách hay nhất để tự chăm sóc xe theo ý của bạn',
  placeholder: 'Tìm kiếm sản phẩm',
};

class Index extends Component {
  render() {
    const {content, handleCart, onChangeText, onEndEditing, onFocus, quantityCart, value} = this.props;
    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.containerText}>
              <Text style={styles.textTitle}>{textTitle.store}</Text>
              <Text style={styles.textTitle}>{textTitle.selfCare}</Text>
              <Text style={styles.textDetail}>{textTitle.content}</Text>
            </View>
            <TouchableOpacity style={styles.containerCart} onPress={handleCart}>
              <IconCart quantity={quantityCart} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {content}
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={textTitle.placeholder}
            onChangeText={onChangeText}
            onEndEditing={onEndEditing}
            onFocus={onFocus}
            value={value}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  header: {
    width,
    height: width*0.49 ,
    backgroundColor: '#00BBDC',
    borderBottomRightRadius: width*0.06,
    borderBottomLeftRadius: width*0.06,
    marginBottom: width*0.02
  },
  content:{
    // marginTop: width*0.05,
    minHeight: height-width*0.7,
  },
  textTitle: {
    color: "#fff",
    fontFamily: fonts.primaryBold,
    fontSize: fontSize.f22,
    letterSpacing: 1.38,
    // width: width*0.46
  },
  textDetail: {
    color: '#fff',
    fontSize: fontSize.f14,
    letterSpacing: 0.88,
    fontFamily: fonts.primarySemiBold
  },
  containerText:{
    marginTop: width*0.16,
    marginLeft: width*0.045
  },
  containerCart: {
    position: 'absolute',
    right: width*0.045,
    top: width*0.16
  },
  containerSearch: {
    position: 'absolute',
    bottom: -width*0.06,
    left: width*0.045,
    // backgroundColor: 'transparent'
  },
  textInput: {
    height: width*0.1333,
    width: width*0.96,
    backgroundColor: '#fff',
    position: 'absolute',
    top: width*0.41,
    left: width*0.02,
    fontFamily: fonts.primaryRegular,
    fontSize: fontSize.f16,
    borderRadius: width*0.04,
    paddingHorizontal: width*0.05,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: Platform.OS === 'ios'? 0.2 : 1,
    shadowRadius: 10,
    elevation: 10,

  }
});

export default Index;
