import {StyleSheet} from 'react-native';
import fontSize from '../../styles/fontSize';
import fonts from '../../styles/fonts';

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 15,
    height: 60,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: fontSize.f20,
    color: '#344356',
    shadowColor: 'rgba(60, 128, 209, 0.09)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,
    elevation: 2,
    fontFamily: fonts.primarySemiBold,
  },
  placeholderStyle: {
    color: '#34435630',
    fontFamily: fonts.primaryRegular,
    fontSize: 20,
  }
});

export default styles;
