import React, { Component } from 'react';
import {View, ScrollView, TouchableWithoutFeedback, Dimensions, BackHandler,} from 'react-native';
import { connect } from "react-redux";
import moment from 'moment';
import format from '../../styles/format';

import {HeaderHome, MultiplePlaceHolders} from '../../components';
import {ButtonNotification, Home} from "../../containers";

const {width} = Dimensions.get('screen');
const {Calendar, CareTips, ListButton, TopSeller, Trending} = Home;

class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleService: "",
      booking: null
    };
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        this.getApiHome();
      }
    );
  }

  componentDidMount = async () => {
    const {profile} = this.props.app;
    if (profile) {
      this.getApiHome();
      this.props.getCartApi(profile.id);
      this.props.getApiHomeBlog();
      // NotificationManager.getInstance().checkPermission(profile.id);
    }
    BackHandler.addEventListener("hardwareBackPress", this.backAction);
  };

  // eslint-disable-next-line react/sort-comp
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    if(Object.hasOwnProperty.call(this,'willFocusSubscription') &&
      Object.hasOwnProperty.call(this.willFocusSubscription, 'remove')) {
      this.willFocusSubscription.remove();
    }
  }

  componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
    const {data} = nextProps.home;
    if(data && data !== this.props.home.data) {
      this.receiveData(data);
    }
  }

  backAction = () => true;

  getApiHome = () => {
    const {profile} = this.props.app;
    this.props.getApiHome(profile.id);
    this.props.getNotification(profile.id);
  };

  receiveData = async (data) => {
    const {category} = data;
    const booking = this.findBooking();
    const titleService = await category.map((cate) => {
      // const {service} = booking[0];
      if (booking && booking.hasOwnProperty('category_id')){
        if(cate.id === booking.category_id){
          return cate.content
        }
      }
    });
    this.setState({titleService});
  };

  onPressTrend = (item) => {
    const {category_id} = item;
    const {data} = this.props.home;
    if (data && category_id && data.category && data.category.length > 0) {
      for( let i = 0; i <= data.category.length - 1; i++) {
        const category = data.category[i];
        if(category.id === category_id) {
          this.props.navigation.navigate('Services',{category, trend:item});
          break;
        }
      }
    }
  };

  onPressLoadMore = () => this.props.navigation.navigate('ShopCategories');

  onPresentToServiceDetail = (item) => {
    if (item.type === '1' && item.id) {
      this.props.navigation.navigate("ServiceDetail",{detailId: item.id})
    }
  };

  findBooking = () => {
    const { data } = this.props.home;

    let booking = null;
    if(data && data.booking && data.booking.length > 0) {
      const listService = data.booking.filter(item => (Object.hasOwnProperty.call(item, 'type') && item.type === '1'));
      const today = moment();
      // console.log("today: ", today);
      let bookingDate = null;
      listService.forEach((item) => {
        let dateString = '';
        if(Object.hasOwnProperty.call(item, 'date_booking') &&
          Object.hasOwnProperty.call(item, 'time_booking')){
          let splitTime = item.time_booking.match(format.startTime);
          // console.log("splitTime: ", splitTime);
          if(splitTime.length > 0 && splitTime[0].length === 5 ) {
            dateString = `${item.date_booking} ${splitTime[0]}`;
            // console.log("dateString: ", dateString);
            const itemDate = moment(dateString, format.inputDateTimeFormat);
            if (today.isBefore(itemDate)) {
              if(booking === null ||
                ( bookingDate !== null && bookingDate.isAfter(itemDate))) {
                booking = item;
                bookingDate = itemDate;
              }
            }
          }
        }
      });

    }
    return booking;
  };

  renderCalendar = () => {
    const data = this.findBooking();
      if(data && data.service){
        return(
          <Calendar
            data={data}
            serviceName={this.state.titleService}
            onPress={() => this.onPresentToServiceDetail(data)}
          />
        )
      }
      return null
  };

  renderBody = () => {
    const {data} = this.props.home;
    return  (
      <View style={{flex:1}}>
        <ScrollView contentContainerStyle={{paddingBottom: width*0.12}} showsVerticalScrollIndicator={false}>
          <TouchableWithoutFeedback>
            <View style={{marginTop: width*0.12}}>
              {
                data ? <ListButton data={data.category} navigation={this.props.navigation} />: null
              }
              {
                data? (
                  <Trending
                    data={data.trending}
                    onPressTrend={this.onPressTrend}
                    onPressLoadMore={this.onPressLoadMore}
                    navigation={this.props.navigation}
                    // category={}
                  />
                ) : null
              }
              {
                data ? <TopSeller data={data.hot_product} navigation={this.props.navigation} /> : null
              }
              {
                this.renderCalendar()
              }
              <CareTips navigation={this.props.navigation} />
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    );
  };

  goNotification = () => {
    this.props.navigation.navigate('Notifications');
  };


  render() {
    const { isFetching} = this.props.home;
    const loading = (
      <View>
        <MultiplePlaceHolders />
        <MultiplePlaceHolders />
        <MultiplePlaceHolders />
      </View>
    );
    const {data} = this.props.notifications;
    const countNotify = data ? data.unread.length : 0;
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <HeaderHome
            content={isFetching? loading : this.renderBody(this)}
            profile={this.props.app.profile}
            navigation={this.props.navigation}
          />
          <ButtonNotification
            countNotify={countNotify}
            onPress={this.goNotification}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
    homeBlog: state.HomeBlogReducer,
    home: state.HomeReducer,
    app: state.app,
    notifications: state.NotificationReducer
  });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/HomeRedux");
  const CartRedux = require("../../redux/CartRedux");
  const { actionBlogs } = require("../../redux/HomeBlogRedux");
  const NotificationRedux = require("../../redux/NotificationRedux");

  return {
    ...ownProps,
    ...stateProps,
    getApiHome: (userId) => actions.getApiHome(dispatch,userId),
    getCartApi: (userId) => CartRedux.actions.getCartApi(dispatch,userId),
    getApiHomeBlog: () => actionBlogs.getApiHomeBlog(dispatch),
    getNotification: (userId) => NotificationRedux.actions.getApiNotification(dispatch,userId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(HomeView);
