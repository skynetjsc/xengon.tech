import React from 'react';
import {
  StyleSheet, TouchableOpacity
} from 'react-native';

import { colors} from '../../styles';

const ButtonShadow = props => {
  const {children, extendStyle} = props;

  return (
    <TouchableOpacity style={[styles.container, extendStyle]} {...props}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default ButtonShadow;
