import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine, ShineOverlay,
} from "rn-placeholder";
import { colors} from '../../styles';

const PlaceHolder = () => (
  <Placeholder
    Animation={ShineOverlay}
    Left={props => (
      <PlaceholderMedia {...props} style={[props.style, styles.lightStyle]} />
    )}
  >
    <PlaceholderLine style={styles.lightStyle} />
    <PlaceholderLine width={80} style={styles.lightStyle} />
    <PlaceholderLine width={30} style={styles.lightStyle} />
  </Placeholder>
);

const styles = StyleSheet.create({
  lightStyle: {
    backgroundColor: colors.white
  },
});

export default PlaceHolder;
