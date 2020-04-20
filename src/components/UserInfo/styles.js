import {StyleSheet} from 'react-native';
import {scale} from 'react-native-size-matters';
import {fonts} from '../../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 20,
    marginTop: 50,
  },
  leftContent: {
    alignItems: 'center',
    marginRight: scale(15),
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#00BBDE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27
  },
  levelWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f7a085',
    borderRadius: 100,
  },
  levelText: {
    fontSize: 12,
    fontFamily: fonts.primaryBold,
    color: '#ffffff',
  },
  rightContent: {
    paddingRight: 10,
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: '#454555',
    marginBottom: 3,
    fontFamily: fonts.primaryBold
  },
  userName: {
    fontSize: 18,
    color: '#00bbdc',
    fontFamily:fonts.primaryBold,
  },
  dayActive: {
    fontSize: 12,
    color: '#888892',
    marginBottom: 3,
    fontFamily:fonts.primaryRegular,
  },
  userPoint: {
    fontSize: 16,
    fontFamily: fonts.primaryBold,
    color: '#f79434',
  },
});

export default styles;
