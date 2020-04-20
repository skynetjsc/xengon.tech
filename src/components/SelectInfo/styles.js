import { Dimensions, StyleSheet } from 'react-native';
import { colors, fontSize } from '../../styles';
import { scale  } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    // height: 60,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 8,
    minHeight: 60,
    shadowColor: 'rgba(60, 128, 209, 0.09)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,
    elevation: 2,
  },
  flex: {flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  leftContent: {
    flex: 1,
  },
  textTitle: {
    fontSize: fontSize.f14,
    color: '#344356',
    opacity: 0.6,
  },
  textContent: {
    fontSize: 18,
    fontWeight: '600',
    color: '#344356',
  },
  imgRight: {width: scale(6), height: scale(11)},
  dropdownTitle: {fontSize: fontSize.f14, color: colors.darkBlueGray, opacity: 0.6},
  btnItem: {flexDirection: "row", alignItems: "center", justifyContent: "space-between",paddingVertical: width*0.02},
});

export default styles;
