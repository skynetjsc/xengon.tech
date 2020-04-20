import {StyleSheet} from 'react-native';
import fonts from '../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  leftIcon: {
    width: 32,
    height: 32,
    marginRight: 20,
  },
  centerContent: {
    flex: 1,
    marginRight: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.primaryBold,
    color: '#344356',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: '#344356',
    opacity: 0.6,
    fontFamily:fonts.primaryRegular,
  },
  rightImg: {width: 6, height: 11, marginRight: 3},
});

export default styles;
