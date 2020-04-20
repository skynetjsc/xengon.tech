import React from 'react';
import {KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard
} from 'react-native';

const KeyboardAvoiding = props => {
  const {children} = props;

  return (
    <KeyboardAvoidingView behavior='position'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
};

export default KeyboardAvoiding;
