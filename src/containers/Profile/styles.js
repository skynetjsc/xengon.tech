import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import fontSize from '../../styles/fontSize';
import fonts from '../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  content: {flex: 1, backgroundColor: '#F3F5F9', paddingHorizontal: scale(30)},
  btnGroup: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 15,
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  btnWrapper: {height: '100%', justifyContent: 'center', flex: 1},
  txtBtn: {
    fontSize: 14,
    textAlign: 'center',
    color: '#344356',
    fontFamily: fonts.primaryRegular,
  },
  btnWrapperCenter: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#F3F5F9',
    borderRightColor: '#F3F5F9',
    borderRightWidth: 1,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  infoWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: scale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  notifiWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: scale(20),
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  imgLeftNotifi: {width: 38, height: 38, marginRight: 20},
  centerNotifi: {flex: 1, justifyContent: 'center', marginRight: 5},
  centerText: {
    fontSize: fontSize.f18,
    color: '#344356',
    fontFamily: fonts.primaryBold
  },
  logoutWrapper: {width: '100%', alignItems: 'center', marginBottom: 15},
  logoutText: {
    fontFamily:fonts.primaryBold,
    fontSize: 16,
    color: '#00d2e9',
  },
  qrCodeWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 27,
    marginBottom: 30,
    shadowColor: 'rgba(60, 128, 209, 0.09)',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowRadius: 19,
    shadowOpacity: 1,
    elevation: 3,
  },
  imageQrCode: {width: scale(260), height: scale(260), marginBottom: 22},
  textQr: {
    opacity: 0.6,
    fontSize: 14,
    color: '#344356',
    fontFamily:fonts.primaryRegular,
    paddingHorizontal: scale(30),
    textAlign: 'center',
  },
});

export default styles;
