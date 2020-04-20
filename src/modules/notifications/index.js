import React, { Component } from 'react';
import { Dimensions, View, FlatList, Image, Text, StyleSheet, ScrollView, TouchableWithoutFeedback  } from 'react-native';

import { connect } from 'react-redux';
import moment from "moment";

import { TabsSelector,HeaderDefault } from '../../containers';
import { colors, fonts, fontSize } from '../../styles';
import {ButtonShadow} from '../../components';
import {
  IconNotiDefault,
  IconNotiCoupon,
  IconNotiBookingService,
  IconNotiOrderProduct,
  IconLubricant,
} from '../../styles/svg';
import APIManager from '../../helpers/APIManager';

const {width} = Dimensions.get('screen');

const listSelect = [
  {
    title: "TẤT CẢ",
  },
  {
    title: "CHƯA XEM",
  },
  {
    title: "ƯU ĐÃI",
  },
];

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSelectorSelected: 0,
    };

    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        this.getDataNotifications();
      }
    );
  }

  componentDidMount(): void {
    // this.getDataNotifications();
  }

  componentWillUnmount(): void {
    if(Object.hasOwnProperty.call(this,'willFocusSubscription') &&
      Object.hasOwnProperty.call(this.willFocusSubscription, 'remove')) {
      this.willFocusSubscription.remove();
    }
  }

  getDataNotifications = () => {
    const {profile} = this.props.app;
    if(profile){
      this.props.getNotification(profile.id);
    }
  };

  getNotificationDetail = (userid,notiId) => {
    APIManager.getInstance().notificationDetail(userid,notiId)
      .then(res => {
        //console.log(res);
      })
      .catch(err => {
        //console.log(err);
      });
  };

  goBack = () => this.props.navigation.goBack();

  onTapSelector = (index) => this.setState({indexSelectorSelected: index});

  getDataBySelector = () => {
    const {indexSelectorSelected} = this.state;
    const {data} = this.props.notifications;
    if (data) {
      if (indexSelectorSelected === 1) {
        return data.unread
      } if (indexSelectorSelected === 2) {
        return data.promotion
      }

      return data.all
    }

    return []
  };

  calculateDateTime = (time) => {
    const today = moment(new Date());
    const createdAt = moment(time);
    const minutes = today.diff(createdAt, 'm');
    const hours = today.diff(createdAt, 'h');

    if (minutes <= 1) {
      return "Vừa xong!"
    } if (minutes < 60 && minutes > 1) {
      return `${minutes} phút trước.`
    } if (hours < 24 && hours >= 1) {
      return `${hours} giờ trước.`
    }
      return moment(createdAt).format("L");

  };

  onNotificationDetail = (detail) => {
    if (detail && detail.type_noty) {
      const {id,type_noty,type_booking,booking_id} = detail;
      if (type_noty === "1" || type_noty === "2") {
        this.props.navigation.navigate("NotificationDetail",{id});
      } else if (type_noty === "3" && booking_id) {
        if (type_booking === "1") {
          this.props.navigation.navigate("ServiceDetail",{detailId: booking_id});
        } else {
          this.props.navigation.navigate("MyOrderScreen",{booking_id});
        }
        const {profile} = this.props.app;
        this.getNotificationDetail(profile.id,id);
      }
    }
  };

  renderItem = ({item, index}) => {
    const time = item.date ? item.date : "";
    const timeString = this.calculateDateTime(time);
    const notifications = this.getDataBySelector();
    const typeNotify = item.type_noty ? item.type_noty : "";
    const typeBooking = Object.hasOwnProperty.call(item,'type_booking')? item.type_booking : '';
    const isRead = item.hasOwnProperty("is_read") && item.is_read ? item.is_read : 0;
    const urlStaff = item.hasOwnProperty("avatar_staff") && item.avatar_staff? item.avatar_staff : "";
    return (
      <ButtonShadow
        extendStyle={[styles.containerItem, {opacity: isRead === 1 ?  0.6 : 1, marginTop: index === 0 ? 20 : 5, marginBottom: index === notifications.length - 1 ? 20 : 5}]}
        onPress={() => this.onNotificationDetail(item)}
      >
        <View>
          {
            typeNotify === "1" ?
              <IconNotiDefault /> :
              typeNotify === "2" ?
                <IconNotiCoupon /> :
                typeBooking === "2"?<IconLubricant /> :( urlStaff !== ""? <Image source={{uri: urlStaff }} style={{width: 40, height: 40, borderRadius: 20}} />:<IconNotiBookingService />)
          }
        </View>
        <View style={styles.viewRight}>
          <Text
            style={[styles.textTitle, {
              color: typeNotify === "2" ? colors.defaultBgButton : colors.gray,
            }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.textContent} numberOfLines={1}>{item.content}</Text>
        </View>
        <View style={styles.time}>
          <Text style={styles.textTime}>{timeString}</Text>
        </View>
      </ButtonShadow>
    )
  };

  render() {
    const notifications = this.getDataBySelector();

    return (
      <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
        <HeaderDefault title="Thông báo" onPressBack={this.goBack} />
        <ScrollView>
          <TabsSelector
            listSelect={listSelect}
            onPress={this.onTapSelector}
            indexSelectorSelected={this.state.indexSelectorSelected}
            style={{width: width*0.84, marginLeft: width*0.025}}
          />
          {
            notifications.length > 0 && (
              <View style={{flex: 1}}>
                <FlatList
                  data={notifications}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => `${item.id}`}
                />
              </View>
            )
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerItem: {
    minHeight: width * 0.2,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: width*0.032,
    paddingHorizontal: width*0.04,
    marginVertical: 5,
  },
  textTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts.primarySemiBold,
    maxWidth: width*0.637333,
  },
  textContent: {
    fontSize: fontSize.f14,
    fontFamily: fonts.primaryRegular,
    color: "#888892",
    maxWidth: width*0.55
  },
  image: {
    height: width*0.12,
    width: width*0.12,
    borderRadius: width*0.06,
    marginRight: width*0.04
  },
  viewRight: {
    height: width*0.12,
    justifyContent: "space-around",
    marginLeft: 10
  },
  time: {
    position: "absolute",
    bottom: width*0.02,
    right: width*0.02
  },
  textTime: {
    fontSize: fontSize.f12,
    fontFamily: fonts.primaryRegular,
    color: "#888892",
  }
});

const mapStateToProps = (state) => ({
  app: state.app,
  notifications : state.NotificationReducer
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/NotificationRedux");

  return {
    ...ownProps,
    ...stateProps,
    getNotification: (userId) => actions.getApiNotification(dispatch,userId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(Index);

