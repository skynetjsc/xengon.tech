import React from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import { colors} from '../../styles';

const ViewShadow = props => {
  const {children, style} = props;

  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});

export default ViewShadow;
