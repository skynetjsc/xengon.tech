import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import fonts from '../../styles/fonts';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 30,
  },
  content: {
    flex: 1,
    backgroundColor: '#F3F5F9',
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  btnBack: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  imgHeader: {
    width: 20,
    height: 20,
  },
  textHeaderWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  textHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#344356',
  },
  avatarContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: '#00BBDE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36
  },
  textAvatar: {
    fontSize: 12,
    letterSpacing: 0,
    color: '#888892',
  },
  editUserInfo: {
    paddingHorizontal: 12,
    marginBottom: 35,
  },
  textInputInfo: {
    marginBottom: 15
  },
  btnUpdateInfo: {
    alignSelf: 'center',
    height: 60,
    borderRadius: 15,
    backgroundColor: '#00d2e9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
    marginBottom: 60,
  },
  textUpdateInfo: {
    fontSize: 20,
    fontFamily: fonts.primaryBold,
    letterSpacing: 1.25,
    color: '#ffffff',
  },
});

export default styles;
