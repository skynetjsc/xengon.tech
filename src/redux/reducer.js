import { combineReducers } from 'redux';

// ## Generator Reducer Imports
import app from '../modules/AppState';
import {HomeReducer} from './HomeRedux';
import {HomeBlogReducer} from './HomeBlogRedux';
import {ServiceDetailReducer} from './ServiceDetailRedux';
import {ShopReducer} from './ShopRedux';
import {ActivitiesReducer} from './ActivitiesRedux';
import {ProductDetailReducer} from './ProductDetailRedux';
import {NotificationReducer} from './NotificationRedux';
import {CartReducer} from './CartRedux';
import {AddressReducer} from './AddressRedux';
import {OrderDetailReducer} from './OrderDetailRedux';
import {CategoryProductReducer} from "./GetCategoryProductRedux";
import {ConfigReducer} from "./ConfigsRedux";
import {WorkShopReducer} from "./AddressWorkshop"

export default combineReducers({
  // ## Generator Reducers
  app,
  HomeReducer,
  ServiceDetailReducer,
  ShopReducer,
  ActivitiesReducer,
  ProductDetailReducer,
  NotificationReducer,
  CartReducer,
  AddressReducer,
  OrderDetailReducer,
  CategoryProductReducer,
  HomeBlogReducer,
  ConfigReducer,
  WorkShopReducer
});
