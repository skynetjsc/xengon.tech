import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View, Dimensions, StatusBar, Image,
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import {connect} from 'react-redux';
import Modal from "react-native-modal";
import * as actions from "../../modules/AppState";

import { IconFurniture } from '../../styles/svg';
import { colors, commonStyle, fonts, fontSize } from '../../styles';

import { ViewShadow, ButtonFrame,Text } from '../../components';

const {width} = Dimensions.get("window");

const label = {
  headerTitle: "Cảm ơn,",
  headerSubTitle: "Anh, chị đã lựa chọn dịch vụ",
  accept: "ĐỒNG Ý",
  cancel: "Xem lại các hoạt động"
};

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'Main' })],
});


class ModalConfirm extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.navigation = this.props.navigation;
  }

  onHome = async () => {
    await this.props.setModalOpened(false);
    this.props.navigation.dispatch(resetAction);
  };

  onPresentToActivity = async () => {
    await this.props.setModalOpened(false);
    this.navigation.navigate('Activity');
  };

  render() {
    const {isOpenModal,} = this.props.app;
    const {serviceDetail,category} = this.props;
    const nameService = serviceDetail.hasOwnProperty("name") ? serviceDetail.name : "";
    const nameCategory = category.hasOwnProperty("content") ? category.content : "";
    const contentService = serviceDetail.hasOwnProperty("content") ? serviceDetail.content : "";
    // console.log(serviceDetail);
    return (
      <Modal isVisible={isOpenModal || false}>
        <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,0.7)" translucent />
        <View style={styles.modalContainer}>
          <ViewShadow style={styles.viewShadowContainer}>
            <Text style={[commonStyle.h1, {color: colors.default}]}>
              {label.headerTitle}
            </Text>
            <Text style={{...commonStyle.h3, marginBottom: width*0.093, fontFamily: fonts.primaryRegular}}>
              {label.headerSubTitle}
            </Text>

            <View style={styles.bodyContainer}>
              {
                Object.prototype.hasOwnProperty.call(category, "img") ? (
                  <Image source={{uri: category.img}} style={{height:84, width: 84, borderRadius:42}} />
                ) :
                  <IconFurniture fill="#00D2E9" fillOpc={0.38} width={85} height={85} radius={44} />
              }
              <View style={{marginLeft: 10,flexShrink:1}}>
                <Text style={commonStyle.h3} numberOfLines={2}>{nameCategory}</Text>
                <Text style={{fontFamily: fonts.primaryBold}}>{nameService}</Text>
                <Text style={{color: colors.gray, marginTop: 2}}>{contentService}</Text>
              </View>
            </View>

            <ButtonFrame
              title={label.accept}
              onPress={this.onHome}
            />
            <TouchableOpacity
              style={{paddingVertical: 10}}
              onPress={this.onPresentToActivity}
            >
              <Text style={{textAlign: "center"}}>{label.cancel}</Text>
            </TouchableOpacity>
          </ViewShadow>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  bodyContainer:{flexDirection: "row", alignItems: "center", marginBottom: width*0.107},
  modalContainer: { flex: 1 , alignItems: "center", justifyContent: "center"},
  viewShadowContainer: {width: width*0.84, marginHorizontal: fontSize.f30, padding: fontSize.f25}
});

const mstp = (state) => ({
  app: state.app
});
export default connect(mstp, actions)(ModalConfirm);
