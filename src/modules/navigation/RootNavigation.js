import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

// TODO : Authentication
import Introduction from '../introductions/Introduction';
import Login from '../login/Login';
import Verification from '../login/Verification';
import Name from '../login/Name';
import Cars from '../login/Cars';
import Notification from '../login/Notification';

// TODO : Service
import ServicesScreen from '../services/ServicesView';
import ServicesConfirmStep from '../services/ServicesConfirmStep';
import ServiceDetailScreen from '../serviceDetail/ServiceDetailView';
import LocationView from '../../containers/ServicesConfirmStep/MapView';

// TODO: Cart
import CartScreen from '../cart/index';
import CheckoutScreen from '../cart/Checkout';

// TODO: Order
import MyOrder from '../order/MyOrder';

// TODO: Product
import ProductRating from '../product/ProductRating';
import ProductDetail from '../productDetail/ProductDetail/ProductDetail';
import ProductReviews from '../productDetail/ProductReviews/ProductReviews';
import AllProductScreen from '../../components/AllProductScreen'

// TODO: Store
import ShopCategoriesView from '../shopCategories/ShopCategoriesView';
import ShopItems from '../shopItems/ShopItems';

// TODO: Profile
import EditInfoScreen from '../../containers/EditInfo';

// TODO: Notifications
import Notifications from '../notifications';
import NotificationDetail from '../notifications/detail';

// TODO: Terms
import Terms from '../terms';
import Support from '../support/index';

// TODO: Blog
import BlogDetail from '../blog/BlogDetail';

const MainNavigator = createStackNavigator(
  {
    Login: {
      screen: Login,
      path: "Login"
    },
    Main: {
      screen: MainTabNavigator,
    },
    Services: {
      screen: ServicesScreen,
    },
    ServicesConfirmStep: {
      screen: ServicesConfirmStep,
    },
    LocationView: {
      screen: LocationView,
    },
    ServiceDetail: {
      screen: ServiceDetailScreen,
    },
    ShopCategories: {
      screen: ShopCategoriesView,
    },
    ShopItems: {
      screen: ShopItems,
    },
    ProductDetail: {
      screen: ProductDetail,
    },
    Cart: {
      screen: CartScreen,
    },
    Checkout: {
      screen: CheckoutScreen,
    },
    MyOrderScreen: {
      screen: MyOrder,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    ProductRating: {
      screen: ProductRating
    },
    ProductReviews: {
      screen: ProductReviews
    },
    EditProfile: {
      screen: EditInfoScreen
    },
    Notifications: {
      screen: Notifications,
      path: "notifications"
    },
    NotificationDetail: {
      screen: NotificationDetail,
      path: "notificationDetail"
    },
    Terms: {
      screen: Terms,
    },
    Support: {
      screen: Support,
    },
    AllProductScreen: {
      screen: AllProductScreen
    },
    BlogDetail: {
      screen: BlogDetail,
    }
  },
  {
    headerMode: 'none',
  },
);

const AuthenticationNavigator = createStackNavigator({
  Introduction: {
    screen: Introduction,
  },
  Verification: {
    screen: Verification,
  },
},{
    headerMode: 'none',
  },
);

const InformationRegister = createStackNavigator({
    Name: {
      screen: Name,
    },
    Cars: {
      screen: Cars
    },
    Notification: {
      screen: Notification
    },
  },{
    headerMode: 'none',
  },
);

const AppNavigator = createSwitchNavigator({
  Authentication: AuthenticationNavigator,
  InformationRegister,
  MainRoute: {
    screen: MainNavigator,
    path: 'main'
  }
},{
  initialRouteName: "Authentication"
});

export default createAppContainer(AppNavigator);
