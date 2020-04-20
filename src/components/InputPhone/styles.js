import {StyleSheet} from 'react-native';
import { fonts, fontSize } from '../../styles';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginBottom: 15,
    borderRadius: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    shadowColor: 'rgba(60, 128, 209, 0.09)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,
    elevation: 2,
  },
  textLeft: {
    fontSize: fontSize.f20,
    fontFamily: fonts.primarySemiBold,
    color: '#344356',
    paddingRight: 10,
  },
  textInput: {
    height: 60,
    flex: 1,
    backgroundColor: '#ffffff',
    fontSize: fontSize.f20,
    fontFamily: fonts.primarySemiBold,
    color: '#344356',
  },
});

export default styles;
