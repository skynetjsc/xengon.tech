import React, { Component } from 'react';
import {View, Dimensions, StyleSheet, Text, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView} from 'react-native';

import Modal from "react-native-modal";
import { fontSize, fonts } from '../styles';
import {IconCarModal} from '../styles/svg';
import { ViewShadow, ButtonFrame } from ".";
import { AirbnbRating, Rating} from 'react-native-ratings';

const {width} = Dimensions.get('screen');

class ModalFrame extends Component {
  render() {
    const {handleReject, handleSuccess, rating, handleSendRating,isVisible,onChangeText,contentReview,onFinishRating} = this.props;
    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <Modal
          isVisible={isVisible}
          style={{justifyContent: 'center', alignItems: 'center'}}
        >
          <KeyboardAvoidingView behavior='position'>
            { !rating ? (
              <ViewShadow style={styles.container}>
                <Text style={styles.text}>Chuẩn bị hoàn tất,</Text>
                <Text style={styles.textContent}>Anh, chị có chắc đã kiểm tra tình trạng xe và kết thúc dịch vụ không ?</Text>
                <View style={{width: width*0.668, alignItems:'center', marginVertical: width*0.096}}>
                  <IconCarModal />
                </View>
                <View>
                  <ButtonFrame
                    title='KIỂM TRA LẠI'
                    color='#424243'
                    onPress={handleReject}
                  />
                  <ButtonFrame
                    title='OK! ĐÃ HOÀN TẤT'
                    onPress={handleSuccess}
                  />
                </View>
              </ViewShadow>
            ) : (
              <ViewShadow style={styles.container}>
                <Text style={styles.text}>Cảm ơn,</Text>
                <Text style={styles.textContent}>Anh, chị đã sử dụng dịch vụ
                  hãy giúp xe ngon cải thiện hơn bằng cách đánh giá chúng em!</Text>
                <View style={{marginTop: width*0.04, marginLeft: -width*0.28}}>
                  <AirbnbRating
                    count={5}
                    defaultRating={4}
                    size={35}
                    showRating={false}
                    onFinishRating={onFinishRating}
                  />
                </View>
                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Viết nhận xét ..."
                    multiline
                    onChangeText={onChangeText}
                    value={contentReview}
                  />
                </View>
                <View>
                  <ButtonFrame
                    title='GỬI'
                    onPress={handleSendRating}
                  />
                </View>
              </ViewShadow>
            )}
          </KeyboardAvoidingView>
        </Modal>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width*0.84,
    padding: width*0.075,
  },
  text: {
    fontSize: fontSize.f26,
    fontFamily: fonts.primaryBold,
    color: '#344356'
  },
  textContent: {
    fontSize: fontSize.f18,
    fontFamily: fonts.primaryRegular,
    color: '#344356',
  },
  viewInput: {
    height: width*0.304,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: width*0.04,
    width: width*0.75,
    alignItems:'center',
    marginTop: width*0.05,
    marginLeft: -width*0.04,
    marginBottom: width*0.08
  },
  textInput: {
    width: width*0.65,
    margin: width*0.04,
    fontFamily: fonts.primaryRegular
  }
});

export default ModalFrame;
