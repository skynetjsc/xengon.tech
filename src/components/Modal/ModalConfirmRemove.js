import * as React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import {scale} from 'react-native-size-matters';

import { colors, fonts, fontSize } from '../../styles';
import { ButtonFrame, ViewShadow ,Text} from '../index';
import Modal from "react-native-modal";

const { width } = Dimensions.get('window');

class ModalConfirmRemove extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {isVisible,title,smallTitle,titleCancel,onSubmit,onCancel, body} = this.props;

    return (
      <Modal isVisible={isVisible}>
        <ViewShadow style={styles.containerModal}>
          <View style={{marginBottom: width*0.05}}>
            <Text style={styles.text1}>
              <Text style={{color: colors.redLight,fontFamily: fonts.primaryBold}}>
                {title}
              </Text>,
            </Text>
            <Text style={styles.text2}>{smallTitle}</Text>
          </View>
          {body}
          <ButtonFrame
            title='ĐỒNG Ý'
            style={styles.buttonModal}
            onPress={onSubmit}
          />
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.text3}>{titleCancel}</Text>
          </TouchableOpacity>
        </ViewShadow>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  containerModal: {
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 376,
    padding: scale(20),
    marginHorizontal: scale(10)
  },
  text1: {
    fontSize: fontSize.f26,
    color: colors.darkBlueGray,
    fontFamily: fonts.primaryBold
  },
  text2: {
    fontSize: fontSize.f20,
    color: colors.darkBlueGray,
  },
  text3: {
    color: "#424243",
    padding: 5,
    fontSize: fontSize.f14
  },
  buttonModal: {
    backgroundColor: colors.redLight,
    width: width*0.7,
    marginTop: 30
  },
});

export default ModalConfirmRemove;
