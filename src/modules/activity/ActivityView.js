import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Dimensions, Platform} from 'react-native';
import { connect } from "react-redux";

import { colors } from '../../styles';

import {ItemActivityProduct,ItemCalendarHome} from '../../components'
import { ButtonNotification, TabsSelector} from '../../containers';
import ActivityNotFound from './ActivityNotFound';
import {IconLubricant} from "../../styles/svg";
import app from '../AppState';

const {width} = Dimensions.get('screen');

const listSelect = [
  {
    title: "TẤT CẢ",
  },
  {
    title: "ĐANG CHỜ",
  },
  {
    title: "HOÀN TẤT",
  },
];

class ActivityView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexSelectorSelected: 0,
    };

    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        this.getDataActivities();
      }
    );

  }

  componentDidMount(): void {
    this.getDataActivities();
  }

  componentWillUnmount(): void {
    if(Object.hasOwnProperty.call(this,'willFocusSubscription') &&
    Object.hasOwnProperty.call(this.willFocusSubscription, 'remove')) {
      this.willFocusSubscription.remove();
    }

  }

  getDataActivities = () => {
    this.props.getApiActivities(this.props.app.profile.id);
    this.props.getNotification(this.props.app.profile.id);
  };

  onTapSelector = (index) => {
    this.setState({indexSelectorSelected: index});
  };

  onPresentToServiceDetail = (item) => {
    if (item.type === '1' && item.id) {
      this.props.navigation.navigate("ServiceDetail",{detailId: item.id})
    }
  };

  onPresentToOrderDetail = (item) => {
    if (item.type === '2') {
      //console.log("item: ", item);
      this.props.navigation.navigate("MyOrderScreen",{booking_id: item.id})
    }
  };

  goNotification = () => {
    this.props.navigation.navigate('Notifications');
  };

  renderItem = ({item}) => {
    const{data} = this.props.home;
    const {service} = item;
    let serviceName = '';
    if(data && Object.hasOwnProperty.call(data, 'category') &&
      service && Object.hasOwnProperty.call(service, 'category_id')) {
      // eslint-disable-next-line camelcase
      const {category_id} = service;
      // eslint-disable-next-line no-plusplus
      for( let i = 0; i < data.category.length; i++) {
        // eslint-disable-next-line camelcase
        if(data.category[i].id === category_id){
          serviceName = data.category[i].content;
          break;
        }
      }
    } else if(item.type === '2' ) {
      const icon = (<IconLubricant />);
      return  (
        <View style={{paddingTop: width*0.05}}>
          <ItemActivityProduct
            title="Sản phẩm tự chăm sóc xe"
            codeProduct={`#${item.code}`}
            day={item.date_booking}
            total={item.total_money}
            iconRight={icon}
            status={item.active}
            onPress={() => this.onPresentToOrderDetail(item)}
          />
        </View>
      )
    } else {
      return null;
    }

    return (
      <View style={{paddingTop: width*0.05}}>
        <ItemCalendarHome
          data={item}
          serviceName={serviceName}
          showIconStatus
          onPress={() => this.onPresentToServiceDetail(item)}
        />
      </View>
    )
  };


  render() {
    const {data} = this.props.activities;
    const {indexSelectorSelected} = this.state;
    let showingItems = [];
    switch (indexSelectorSelected) {
      case 1:
        if(data &&
          Object.hasOwnProperty.call(data, 'waiting')) {
          showingItems = data.waiting;
        }
        break;
      case 2:
        if(data &&
          Object.hasOwnProperty.call(data, 'finished')) {
          showingItems = data.finished;
        }
        break;
      default:
        if (data &&
          Object.hasOwnProperty.call(data, 'all')) {
          showingItems = data.all;
        }
    }
    const {notifications} = this.props;
    const countNotify = notifications.data ? notifications.data.unread.length : 0;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TabsSelector
            listSelect={listSelect}
            onPress={this.onTapSelector}
            indexSelectorSelected={this.state.indexSelectorSelected}
            // loadingSelector={loadingSelector}
            style={{width: width*0.84, marginLeft: width*0.025}}
          />
        </View>
        <View style={{flex: 1}}>
          {
            data && data.all && data.all.length > 0?
              (
                <FlatList
                  contentContainerStyle={{paddingBottom: width*0.09}}
                  style={{paddingTop: width*0.03,}}
                  data={showingItems}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                />
              )
              :
              (
                <View style={{flex: 1}}>
                  <ActivityNotFound
                    navigation={this.props.navigation}
                    category={this.props.home.data && this.props.home.data.category[0]}
                  />
                </View>
              )
          }
        </View>
        <ButtonNotification
          // countNotify={3}
          countNotify={countNotify}
          onPress={this.goNotification}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor,
  },
  header: {
    height: width*0.3,
    justifyContent: 'flex-end',
    backgroundColor: colors.defaultBackgroundColor,
    shadowColor: "#3C80D1",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: Platform.OS === 'ios'?0.2 : 1,
    shadowRadius: 3,
    elevation: 10,
    marginBottom: 1
  }
});

const mapStateToProps = (state) => ({
  activities: state.ActivitiesReducer,
  app: state.app,
  home: state.HomeReducer,
  notifications: state.NotificationReducer
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/ActivitiesRedux");
  const NotificationRedux = require("../../redux/NotificationRedux");
  return {
    ...ownProps,
    ...stateProps,
    getApiActivities: (userId) => actions.getApiActivities(dispatch,userId),
    getNotification: (userId) => NotificationRedux.actions.getApiNotification(dispatch,userId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ActivityView);
