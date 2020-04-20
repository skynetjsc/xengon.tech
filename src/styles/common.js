import { StyleSheet, StatusBar, Platform } from 'react-native';

import colors from './colors';
import { fonts, fontSize } from './index';

const commonStyle = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.select({ ios: 0, android: StatusBar.currentHeight }),
  },
  regular: {fontSize: fontSize.f13, fontFamily: fonts.primaryRegular},
  h1: {fontSize:fontSize.f26, color: colors.darkBlueGray, fontFamily: fonts.primaryBold},
  h3: {fontSize:fontSize.f20, color: colors.darkBlueGray, fontFamily: fonts.primaryBold},
  h4: {fontSize:fontSize.f16, color: colors.darkBlueGray, fontFamily: fonts.primaryBold}
});

export default commonStyle;
