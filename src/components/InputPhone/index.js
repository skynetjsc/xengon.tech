import * as React from 'react';
import {View, Text, TextInput} from 'react-native';
import styles from './styles';

const InputInfo = ({styleText,style, ...props}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.textLeft}>+84</Text>
      <View style={{borderWidth: 1, borderColor: '#34435620', width: 1, height: 30, marginRight: 15}} />
      <TextInput
        style={[styles.textInput, styleText]}
        placeholderTextColor={'#34435630'}
        keyboardType='numeric'
        {...props}
      />
    </View>
  );
};

export default InputInfo;
