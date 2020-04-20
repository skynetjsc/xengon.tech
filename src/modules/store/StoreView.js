import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions, BackHandler,
} from 'react-native';
import { connect } from "react-redux";
import { ButtonNotification, Store } from '../../containers';
import LoadMore from '../../helpers/LoadMoreManager';

const {width} = Dimensions.get('screen');

const {Header, Categories, ListItem} = Store;

const title = {
  bestSeller: 'BÁN CHẠY NHẤT',
  exterior: 'NGOẠI THẤT',
  furniture: 'NỘI THẤT'
};

class StoreView extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {
        index: LoadMore.index,
        numberPost: LoadMore.numberPost,
        userId: this.props.app.profile.id,
        key: "",
      },
      focus: false,
    };
    this.willFocusSubscription = props.navigation.addListener(
      'willFocus',
      payload => {
        this.getNotification();
      }
    );
  }

  // componentDidMount(): void {
  //   const {profile} = this.props.app;
  //   if(profile){
  //     this.props.getApiShop(profile.id);
  //   }
  // };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    if(Object.hasOwnProperty.call(this,'willFocusSubscription') &&
      Object.hasOwnProperty.call(this.willFocusSubscription, 'remove')) {
      this.willFocusSubscription.remove();
    }
  }

  getNotification = () => {
    const {profile} = this.props.app;
    this.props.getApiShop(profile.id);
    this.props.getNotification(profile.id);
  };

  onChangeText = text => {
    const {data} = this.state;
    data.key = text;
    this.setState({data});
  };

  onEndEditing = () => {
    const {data} = this.state;
    const dataPage = Object.assign({}, data);
    data.index = LoadMore.index;
    data.numberPost = LoadMore.numberPost;
    if(data.key !== ""){
      data.key = "";
      this.setState({focus: false, data}, () => {
        this.props.navigation.navigate("ShopItems", {dataPage});
      })
    } else {
      this.setState({
        focus: false,
      });
    }
  };

  onFocus = () => {
    // const {data} = this.state;
    // data.key = "";
    this.setState({
      focus: true,
    });
  };

  onMiniCartView = () => {
    this.props.navigation.navigate("Cart")
  };

  renderBody = () => {
    const {data} = this.props.shop;
    const {focus} = this.state;
    return (
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{paddingBottom: width*0.12}}
          style={{flex: 1, opacity: focus? 0.2: 1}}
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback>
            <View style={{marginTop: width*0.07}}>
              <Categories
                data={data && data.category}
                navigation={this.props.navigation}
              />
              <ListItem
                nameCategories={title.bestSeller}
                data={data && data.hot_product}
                navigation={this.props.navigation}
              />
              <ListItem
                nameCategories={title.exterior}
                data={data && data.product && data.product[1] &&data.product[1].product}
                navigation={this.props.navigation}
                titleHeader={title.exterior}
              />
              {
                data && data.product && data.product[0] && data.product[0].product.length > 0? (
                  <ListItem
                    nameCategories={title.furniture}
                    data={data.product[0].product}
                    navigation={this.props.navigation}
                  />
                ) : null
              }
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    );
  };

  goNotification = () => {
    this.props.navigation.navigate('Notifications');
  };

  getQuantityCart = () => {
    const {data} = this.props.cart;
    let quantity = 0;
    if(data && data.list_product) {
      data.list_product.map(item => {
        quantity += Number(item.number);
      })
    }
    return quantity;
  };

  render() {
    const {data} = this.props.notifications;
    const countNotify = data ? data.unread.length : 0;
    return (
      <View style={styles.container}>
        <Header
          content={this.renderBody(this)}
          handleCart={this.onMiniCartView}
          onChangeText={this.onChangeText}
          onEndEditing={this.onEndEditing}
          onFocus={this.onFocus}
          quantityCart={this.getQuantityCart()}
          value={this.state.data.key}
        />
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
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});

const mapStateToProps = (state) => ({
    shop: state.ShopReducer,
    app: state.app,
    cart: state.CartReducer,
    notifications: state.NotificationReducer
  });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/ShopRedux");
  const CartRedux = require("../../redux/CartRedux");
  const NotificationRedux = require("../../redux/NotificationRedux");
  return {
    ...ownProps,
    ...stateProps,
    getApiShop: (userId) => actions.getApiShop(dispatch,userId),
    getCartApi: (userId) => CartRedux.actions.getCartApi(dispatch,userId),
    getNotification: (userId) => NotificationRedux.actions.getApiNotification(dispatch,userId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(StoreView);

