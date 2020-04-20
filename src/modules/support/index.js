import React, { Component } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';

import Toast from "react-native-tiny-toast";
import { scale } from 'react-native-size-matters';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import * as actions from '../AppState';
import APIManager from '../../helpers/APIManager';

import Assets from '../../../assets';
import { colors, fonts, fontSize, commonStyle } from '../../styles';
import {IconLogo} from '../../styles/svg'

import {ViewShadow,ButtonFrame,Text } from '../../components';
import { HeaderDefault } from '../../containers';
import InfoItem from '../../components/InfoItem';

const {width} = Dimensions.get("window");

class Support extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      indexSelected: null,
      category: null,
    }
  }

  componentDidMount(): void {
    const {profile} = this.props.app;
    if(profile) {
      this.feedbackCategory(profile.id)
    }
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  onChangeText = (text) => {
    this.setState({text});
  };

  feedbackCategory = (user_id) => {
    APIManager.getInstance().feedbackCategory(user_id)
      .then(res => {
        const {data} = res.data;
        if (data) {
          this.setState({category: data})
        }
      })
      .catch((err) => {
        // console.log(err);
        alert("Đã xảy ra lỗi ,vui lòng thử lại!!")
      });
  };

  onSubmit = () => {
    const text = this.state.text.trim();
    const {profile} = this.props.app;
    const {indexSelected, category} = this.state;
    const categoryId = category && indexSelected !== null && category.length > indexSelected && category[indexSelected].hasOwnProperty("id")
      ? category[indexSelected].id : null;

    if (text === "") {
      Toast.show(`Nội dung không được để trống, vui lòng thử lại!`);
    } else if (indexSelected === null) {
      Toast.show(`Vui lòng lựa chọn vấn đề!`);
    } else if (!categoryId) {
      Toast.show(`Không thể gửi được yêu cầu, vui lòng thử lại!ß`);
    } else {
      APIManager.getInstance().feedback(profile.id,categoryId,text)
        .then(res => {
          // console.log(res);
          if (res.data.errorId === 200) {
            Alert.alert(
              "",
              "Cảm ơn vì đã gửi yêu cầu, xengon sẽ phản hồi bạn sớm nhất cho có thể",
              [{text: "OK", onPress: this.goBack}])
          }
        })
        .catch((err) => {
          // console.log(err);
          alert("Đã xảy ra lỗi ,vui lòng thử lại!!")
        });
    }
  };

  handleSelect = (index) => this.setState({indexSelected: index});

  renderItemModal = ({item, index}) => {
    const {indexSelected} =  this.state;
    const name = item.name ? item.name : "";
    return (
      <TouchableOpacity
        style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 7}}
        onPress={() => this.handleSelect(index)}
      >
        <Text style={{fontSize: fontSize.f14}}>{name}</Text>
        {
          indexSelected === index && indexSelected !== null ? (
            <Icon
              name="md-radio-button-on"
              color={colors.default}
              size={26}
            />
          ) : (
            <Icon
              name="md-radio-button-off"
              color={colors.default}
              size={26}
            />
          )
        }
      </TouchableOpacity>
    )
  };

  toggleModal = () => this.setState({isVisible: !this.state.isVisible});

  getItemLayout = (data, index) => (
    {length: 41, index, offset: 41 * index}
  );

  render() {
    const {isVisible,indexSelected, category} = this.state;
    const problem = category && indexSelected !== null && category.length > indexSelected && category[indexSelected].hasOwnProperty("name")
      ? category[indexSelected].name : "Vấn đề mà bạn gặp phải";

    return (
      <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
        <HeaderDefault title="" onPressBack={this.goBack} />
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ViewShadow style={styles.viewShadow}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "padding"} keyboardVerticalOffset={30}>
              <View style={{alignItems: "center"}}>
                <Text style={[commonStyle.h3, {textAlign: "center", fontFamily: fonts.primarySemiBold}]}>
                  Yêu cầu hỗ trợ
                </Text>
                <Text style={{color: colors.grey, marginVertical: 8}}>
                  Được gửi đến hotro@xengon.tech
                </Text>
                <IconLogo style={{marginVertical: 30}} />
              </View>

              <View>
                <View style={{marginHorizontal: 40, marginTop: 15}}>
                  <InfoItem
                    onPress={this.toggleModal}
                    leftImg={Assets.ic_help}
                    title="Lựa chọn vấn đề"
                    subTitle={problem}
                  />
                </View>

                <View style={styles.viewInput}>
                  <TextInput
                    style={styles.textView}
                    multiline
                    value={this.state.text}
                    onChangeText={this.onChangeText}
                    textAlignVertical="top"
                  />
                </View>

                <ButtonFrame
                  title="ĐỀ NGHỊ HỖ TRỢ"
                  style={{letterSpacing: 1.25}}
                  onPress={this.onSubmit}
                />
              </View>
              {
                category  && category.length > 0 && (
                  <Modal
                    isVisible={isVisible}
                    style={{justifyContent: 'center', alignItems: 'center'}}
                  >
                    <ViewShadow style={{maxHeight: 420, width: width - scale(50)}}>
                      <Text style={[commonStyle.h1, {paddingHorizontal: scale(25), marginTop: 15}]}>
                        Chọn vấn đề
                      </Text>
                      <FlatList
                        initialScrollIndex={indexSelected}
                        style={{marginBottom: 30, marginTop: 15}}
                        contentContainerStyle={{paddingHorizontal: scale(25)}}
                        data={category}
                        ref={ref => this.flatListRef = ref}
                        getItemLayout={this.getItemLayout}
                        showsVerticalScrollIndicator={false}
                        renderItem={this.renderItemModal}
                        keyExtractor={(item) => item.id}
                        onScrollToIndexFailed={info => {
                          const wait = new Promise(resolve => setTimeout(resolve, 500));
                          wait.then(() => {
                            this.flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                          });
                        }}
                      />
                      <ButtonFrame
                        title='XONG'
                        onPress={this.toggleModal}
                        style={{marginHorizontal: scale(25), marginBottom: 20}}
                      />
                    </ViewShadow>
                  </Modal>
                )
              }
            </KeyboardAvoidingView>
          </ViewShadow>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewShadow: { marginHorizontal: 10, paddingHorizontal: 25, marginTop: 32, paddingTop: 40, flex: 1},
  viewInput: {
    height: 143,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 15,
    flex: 1,
    marginBottom: 30,
    marginTop: 20,
    padding: 10,
    paddingHorizontal: 15
  },
  textView:{
    flex: 1,
    fontFamily: fonts.primarySemiBold,
    color: colors.darkBlueGray,
    fontSize: 14
  }
});

const mapStateToPros = state => ({
  app: state.app
});
export default connect(mapStateToPros,actions)(Support);

