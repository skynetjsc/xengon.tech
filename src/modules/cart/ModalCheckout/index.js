import React, {PureComponent} from 'react';
import {Dimensions, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import {colors, fonts, fontSize} from "../../../styles";
import TextInputFrame from "../../../components/Text/TextInputFrame";
import ButtonFrame from "../../../components/Button/ButtonFrame";
import Modal from "react-native-modal";

const {width, height} = Dimensions.get("window");

class Index extends PureComponent {
  render() {
    const {isVisible, onBackdropPress, title, placeholder, onChangeText, applyModal, valueTextInput} = this.props;
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
      >
        <KeyboardAvoidingView behavior='position' enabled keyboardVerticalOffset={20}>
          <View style={styles.containerModal}>
            <Text style={{
              fontSize: fontSize.f20,
              fontFamily: fonts.primarySemiBold,
              width: width*0.86,
              margin: width*0.05
            }}
            >
              {title}
            </Text>
            <TextInputFrame
              placeholder={placeholder}
              styleContainer={{width: width*0.86}}
              onChangeText={onChangeText}
              autoFocus={true}
              value={valueTextInput}
            />
            <ButtonFrame
              title='XÁC NHẬN'
              style={{paddingHorizontal: width*0.1, marginVertical: width*0.05}}
              onPress={applyModal}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: width*0.4,
    width: width*0.94,
    backgroundColor: colors.defaultBackgroundColor,
    marginLeft: -width*0.02,
    borderRadius: width*0.04,
  }
});

export default Index;
