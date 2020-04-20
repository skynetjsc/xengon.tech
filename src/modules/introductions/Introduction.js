import React from 'react';
import { StyleSheet, View, Dimensions, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AppIntroSlider from 'react-native-app-intro-slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { connect } from 'react-redux';
import * as actions from '../AppState';
import Login from '../login/Login';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import Assets from '../../../assets';

import {
  ScreenIntroductionAnyWhere,
  ScreenIntroductionGoodService,
  ScreenIntroductionProfessional,
} from '../../styles/svg';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 320,
    height: 320,
  },
  btnIntro: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
  textIntro: {
    fontFamily: fonts.primaryRegular,
    fontSize: 14,
    textAlign: 'center',
    color: '#424243',
  },
});

const slides = [0, 1, 2];

class Introduction extends React.Component {
  constructor() {
    super();
    this.state = {
      firstLaunch: false,
    };
  }

  componentDidMount(): void {
    const { isFirstOpen, isLogin } = this.props.app;

    if (isLogin) {
      this.props.navigation.navigate('Main');
    } else if (isFirstOpen) {
      this.setState({ firstLaunch: true });
      this.props.setAppOpened();
    }
  }

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // this.setState({ showRealApp: true });
    if (Object.prototype.hasOwnProperty.call(this.props, 'navigation')) {
      const { navigation } = this.props;
      navigation.navigate('Login');
    }
  };

  _renderNextButton = () => (
    <TouchableOpacity style={styles.btnIntro} onPress={this._onDone}>
      <Text style={styles.textIntro}>Bỏ qua</Text>
    </TouchableOpacity>
  );

  _renderSkipButton = () => (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="ios-fastforward"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{ backgroundColor: 'transparent' }}
      />
    </View>
  );

  _renderDoneButton = () => (
    <View style={styles.btnIntro}>
      <Text style={styles.textIntro}>Tiếp tục</Text>
    </View>
  );

  renderFirstIntro = () => {
    const originHeight = 117;
    const originWidth = 250;
    const widthBoardDesign = 375;
    const widthImg = width * (originWidth / widthBoardDesign);
    const heightImg = (widthImg * originHeight) / originWidth;

    return (
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(90),
        }}
      >
        <Image
          source={Assets.ic_intro1}
          style={{
            height: heightImg,
            width: widthImg,
            alignSelf: 'center',
            marginBottom: verticalScale(50),
          }}
        />

        <View style={{ paddingRight: 20, marginLeft: 30 }}>
          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 22,
              fontWeight: 'bold',
              letterSpacing: 1.38,
              color: colors.blackTwo,
            }}
          >
            Đặt lịch chăm sóc xe
          </Text>

          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 40,
              fontWeight: 'bold',
              letterSpacing: 2.5,
              color: '#00d2e9',
            }}
          >
            Ở bất cứ đâu
          </Text>

          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 14,
              letterSpacing: 0.88,
              textAlign: 'center',
              color: '#424243',
            }}
          >
            Cho dù bạn ở đâu, chỉ cần đặt lịch hẹn qua ứng dụng, chúng tôi sẽ
            cung cấp các gói chăm sóc xe linh hoạt & chuyên nghiệp. Giảm thiểu
            thời gian tìm kiếm địa điểm và chi phí đi lại.
          </Text>
        </View>
      </View>
    );
  };

  renderSecondIntro = () => {
    const originHeight = 118;
    const originWidth = 250;
    const widthBoardDesign = 375;
    const widthImg = width * (originWidth / widthBoardDesign);
    const heightImg = (widthImg * originHeight) / originWidth;

    return (
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(90),
        }}
      >
        <Image
          source={Assets.ic_intro2}
          style={{
            height: heightImg,
            width: widthImg,
            alignSelf: 'center',
            marginBottom: verticalScale(50),
          }}
        />

        <View style={{ paddingRight: 20, marginLeft: 30 }}>
          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 22,
              fontWeight: 'bold',
              letterSpacing: 1.38,
              color: colors.blackTwo,
            }}
          >
            Siêu nhanh, Siêu rẻ
          </Text>

          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 40,
              fontWeight: 'bold',
              letterSpacing: 2.5,
              color: '#00d2e9',
            }}
          >
            Siêu ngon
          </Text>

          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 14,
              letterSpacing: 0.88,
              textAlign: 'center',
              color: '#424243',
            }}
          >
            Với mục tiêu mang lại trải nghiệm dịch vụ chăm sóc xe tốt nhất tận
            nơi, chúng tôi cung cấp giải pháp hoàn toàn mới chuyên sâu về bảo
            dưỡng nội, ngoại thất, sẵn sàng phục vụ cộng đồng xe hơi.
          </Text>
        </View>
      </View>
    );
  };

  renderThirdIntro = () => {
    const originHeight = 124;
    const originWidth = 336;
    const widthBoardDesign = 375;
    const widthImg = width * (originWidth / widthBoardDesign);
    const heightImg = (widthImg * originHeight) / originWidth;

    return (
      <View
        style={{
          flex: 1,
          paddingTop: verticalScale(90),
        }}
      >
        <Image
          source={Assets.ic_intro3}
          style={{
            height: heightImg,
            width: widthImg,
            alignSelf: 'flex-end',
            marginBottom: verticalScale(50),
          }}
        />

        <View style={{ paddingRight: 20, marginLeft: 20 }}>
          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 22,
              fontWeight: 'bold',
              letterSpacing: 1.38,
              color: colors.blackTwo,
            }}
          >
            Chuyên sâu
          </Text>

          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 35,
              fontWeight: 'bold',
              letterSpacing: 2.5,
              color: '#00d2e9',
            }}
          >
            Chuyên nghiệp
          </Text>

          <Text
            style={{
              fontFamily: fonts.primaryRegular,
              fontSize: 14,
              letterSpacing: 0.88,
              textAlign: 'center',
              color: '#424243',
            }}
          >
            Thời gian trải nghiệm về các dòng xe, thôi thúc chúng tôi tạo ra
            giải pháp mới, nhanh chóng và chuyên nghiệp, bỏ qua các bước không
            cần thiết để rút ngắn thời chăm sóc xe, đạt hiệu quả cao nhất.
          </Text>
        </View>
      </View>
    );
  };

  _renderItem = ({ index }) => {
    if (index === 0) {
      return this.renderFirstIntro();
    }

    if (index === 1) {
      return this.renderSecondIntro();
    }

    return this.renderThirdIntro();
  };

  render() {
    const { firstLaunch } = this.state;

    if (firstLaunch) {
      return (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#F3F5F9',
            // justifyContent: 'space-between',
          }}
          forceInset={{ top: 'always' }}
        >
          <Image
            source={Assets.ic_logo}
            style={{
              height: 33,
              width: 200,
              marginLeft: 25,
              marginTop: verticalScale(50),
            }}
          />

          <AppIntroSlider
            slides={slides}
            renderItem={this._renderItem}
            renderSkipButton={() => null} // {this._renderSkipButton}
            renderDoneButton={this._renderDoneButton}
            renderNextButton={this._renderNextButton}
            showSkipButton={false}
            onDone={this._onDone}
            onSkip={this._onDone}
            dotStyle={{
              width: 10,
              height: 10,
              borderWidth: 1,
              borderColor: '#979797',
              backgroundColor: 'rgba(216, 216, 216, 0)',
            }}
            activeDotStyle={{
              width: 10,
              height: 10,
              borderWidth: 1,
              borderColor: '#979797',
              backgroundColor: '#d8d8d8',
            }}
          />
        </SafeAreaView>
      );
    }
    return <Login notFirstLaunch navigation={this.props.navigation} />;
  }
}

const mstp = state => ({
  app: state.app,
});
export default connect(mstp, actions)(Introduction);
