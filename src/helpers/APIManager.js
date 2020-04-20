import axios from 'axios';
import { Alert, Linking, Platform } from 'react-native';
import firebase from 'react-native-firebase';
import moment from 'moment';
import API from './APIConstant';
import {store} from '../redux/store';
import { resetAppState } from '../modules/AppState';
import format from '../styles/format';
import FastChunkString from './FastChunkString';

export default class APIManager {
  static instance = null;

  static createInstance() {
    const object = new APIManager();
    object._userData = {};
    return object;
  }

  static countAlert = {
    number: 0
  };

  static getInstance() {
    if(!APIManager.instance) {
      APIManager.instance = APIManager.createInstance();
    }
    return APIManager.instance;
  }

  static getHeader = () => {
    const {profile} = store.getState().app;
    const headers = {
      'Content-Type':'application/json',
      'Accept':'application/json',
    };

    if(profile && Object.call.hasOwnProperty.call(profile,'token')) {
      headers.token = `${profile.token}`;
    }
    const time = moment().locale("vi").format(format.ddddDDMMYYYYHHMMSS);
    const logData = JSON.stringify({token: headers.token || ""});
    APIManager.getInstance().sendFirebaseLog('getHeader', {time, logData});
    APIManager.getInstance().sendPrivateLog('getHeader', headers);
    return headers;
  };

  static Logout = async (message) => {
    // const { data } = notification;
    const {profile} = store.getState().app;
    APIManager.getInstance().sendPrivateLog('forceLogout', {message, profile});
    const prefix = Platform.OS === 'android'
      ? 'xengonapp://xengonapp/main/'
      : 'xengonapp://main/';
    const url = `${prefix}Login`;
    Linking.openURL(url)
      .then( () => {
        if (APIManager.countAlert.number < 1) {
          APIManager.countAlert.number += 1;
          Alert.alert(
            "Thông báo",
            message,
            [{text: "OK", onPress: () => {
                APIManager.countAlert.number = 0;
              }}]);
          setTimeout(() => store.dispatch(resetAppState()),500);
        }
      })
      .catch(err => {/*console.error(err)*/});
  };

  sendFirebaseLog = (event, params) => {
    firebase.analytics().logEvent(event, params);
  };

  sendPrivateLog = (event, data) => {
    const {profile} = store.getState().app;
    const PlatformInfo =  {OS: Platform.OS, version: Platform.Version};
    if(Platform.OS === 'android') {
      PlatformInfo.isTV = Platform.isTV;
    } else {
      PlatformInfo.isPad = Platform.isPad;
      PlatformInfo.isTVOS = Platform.isTVOS;
    }
    let id = '';
    let phone = '';
    if(profile
      && Object.hasOwnProperty.call(profile, 'id')
      && Object.hasOwnProperty.call(profile, 'phone')
    ){
      // eslint-disable-next-line prefer-destructuring
      id = profile.id;
      // eslint-disable-next-line prefer-destructuring
      phone = profile.phone
    }
    // const {id, phone} = profile;
    axios.post('http://222.252.20.220:2000/logs', {event, data, profile, Platform:PlatformInfo, userId: id, phone})
      .then()
      .catch(e => {
        // console.log(e);
      });
  };

  setFirebaseLog = (data) => {
    const {id, name, phone, token_fcm, is_noti, token, time_expire} = data;
    firebase.analytics().setUserId(id);
    firebase.analytics().setUserProperties({name, phone, token_fcm, is_noti, token, time_expire});
    APIManager.getInstance().sendPrivateLog('setFirebaseLog', data);
  };

  checkResponse = (response) => {
    const time = moment().locale("vi").format(format.ddddDDMMYYYYHHMMSS);
    APIManager.getInstance().sendPrivateLog('checkResponse', response);
    const {errorId, message} = response.data;
    const logData = {time,response:JSON.stringify({errorId, message}) };
    APIManager.getInstance().sendFirebaseLog(
      'checkResponse',
      logData
    );
    if (errorId === 401) {
      APIManager.Logout((message));
      return null
    }
    return response;
  };


  getHomeAPI = (userId) => {
    const params = `?user_id=${userId}`;
    const url = API.url + API.home + params;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error =>{throw error})
  };

  getHomeBlog = () => {
    const url = API.url + API.homeBlog;
    //console.log(url);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get,url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getBlogImageDetail = (url) => {
    // const url = API.url + API.homeBlog;
    //     // console.log(url);
    const headers = APIManager.getHeader();
    return axios({ method: API.requestType.get, url, headers })
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {
        throw error
      })
  };

  getActivitiesAPI = (userId) => {
    const params = `?user_id=${userId}`;
    const url = API.url + API.bookingList + params;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error =>{throw error})
  };

  verifyCode = (phone) => {
    const url = API.url + API.verifyCode(phone);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get,url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  login = (phone) => {
    const url = API.url + API.login(phone);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get,url,headers})
      .then(response => {
        const res = APIManager.getInstance().checkResponse(response);
        if(res !== null) {
          let {data} = res.data;
          if(res.data.errorId === 200) {
            APIManager.getInstance().setFirebaseLog(data);
          }
          const time = moment().locale("vi").format(format.ddddDDMMYYYYHHMMSS);
          const logData = {
            'errorId': res.data.errorId,
            'phone':phone,
            'token': data && data.token ? data.token : ''
          };
          APIManager.getInstance().sendPrivateLog('login', response);
          APIManager.getInstance().sendFirebaseLog('login', {time, logData});
        }
        return res;
      })
      .catch(error => {throw error})
  };

  register = (data) => {
    const url = API.url + API.register;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post,url, data,headers})
      .then(response => {
        const res = APIManager.getInstance().checkResponse(response);
        if(res !== null) {
          if(res.data.errorId === 200){
            APIManager.getInstance().setFirebaseLog(res.data.data);
          }
          const time = moment().locale("vi").format(format.ddddDDMMYYYYHHMMSS);
          const logData = {
            'errorId': res.data.errorId,
            'phone': res.data.data.phone,
            'token': res.data.data.token,
          };
          APIManager.getInstance().sendFirebaseLog('sign_up', {time, logData});
          APIManager.getInstance().sendPrivateLog('sign_up', response);
        }
        return res;
      })
      .catch(error =>{throw error})
  };

  carBrand = () => {
    const url = API.url + API.carBrand;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get,url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  carType = () => {
    const url = API.url + API.carType;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get,url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  carModel = (car_brand_id,car_type_id,) => {
    const url = API.url + API.carModel(car_brand_id,car_type_id);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get,url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  bookingService = (data) => {
    const url = API.url + API.bookingService;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post,url,data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error =>{throw error})
  };

  getServiceDetail = (categoryId, carTypeId) => {
    const url = `${API.url  }/api/serviceCategoryDetail?category_id=${categoryId}&car_type_id=${carTypeId}`;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error =>{throw error})
  };

  getBookingServiceDetail = (bookingId, userId) => {
    const url = API.url + API.bookingServiceDetail(bookingId,userId);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  updateStatusBooking = (data) => {
    const url = API.url + API.updateStatusBooking;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url, data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  ratingBooking = (data) => {
    const url = API.url + API.ratingBooking;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url, data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  ratingProduct = (data) => {
    const url = API.url + API.ratingProduct;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url, data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  shop = (userId) => {
    const url = `${API.url}${API.shop(userId)}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getProductDetail = (userId, productId) => {
    const url = `${API.url}${API.productDetail(userId, productId)}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  updateAvatar = (data) => {
    const url = API.url + API.updateAvatar;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url, data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  updateProfile = (data) => {
    const url = API.url + API.updateProfile;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url, data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  favouriteProduct = (userId, productId) => {
    const url = `${API.url}${API.favouriteProduct}`;
    const data = new FormData();
    data.append('user_id', userId);
    data.append('product_id', productId);
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.post, url, data, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  unfavouriteProduct = (userId, productId) => {
    const url = `${API.url}${API.unFavourite}`;
    const data = new FormData();
    data.append('user_id', userId);
    data.append('product_id', productId);
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.post, url, data, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getCategory = () => {
    const url = `${API.url}${API.productCategory}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  searchProduct = (data) => {
    let url = `${API.url}${API.searchProduct(data.index, data.numberPost, data.userId, data.key)}`;
    if (data.category_id) {
      url = `${API.url}${API.searchProductCategory(data.index, data.numberPost, data.userId, data.key, data.category_id)}`;
    }
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  notification = (userId) => {
    const url = API.url + API.notification(userId);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  notificationDetail = (userId, notiId) => {
    const url = API.url + API.notificationDetail(userId,notiId);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  updateToken = (data) => {
    const url = API.url + API.updateToken;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url,data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  updateNotification = (data) => {
    const url = API.url + API.updateNotification;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url,data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  addProductToCart = (userId, productId, quantity) => {
    const url = `${API.url}${API.addProduct}`;
    const data = new FormData();
    data.append('user_id', userId);
    data.append('product_id',  productId);
    data.append('number', quantity);
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.post, url, data, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  deleteProductInCart = (userId, productId) => {
    const url = `${API.url}${API.deleteProduct}`;
    const data = new FormData();
    data.append('user_id', userId);
    data.append('product_id',  productId);
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.post, url, data, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getInfoCart = (userId) => {
    const url = `${API.url}${API.cartInfo(userId)}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  bookingProduct = (user_id, address, promotion_code, note) => {
    const url = `${API.url}${API.bookingProduct}`;
    const data = new FormData();
    data.append('user_id', user_id);
    data.append('address', address);
    data.append('promotion_code', promotion_code);
    data.append('note', note);
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.post, url, data, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error});
  };

  getPrivacy = () => {
    const url = API.url + API.privacy;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  feedbackCategory = (user_id) => {
    const url = API.url + API.feedbackCategory(user_id);
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  // eslint-disable-next-line camelcase
  feedback = (user_id, category_id, content) => {
    const data = new FormData();
    data.append('user_id', user_id);
    data.append('category_id', category_id);
    data.append('content', content);
    const url = API.url + API.feedback;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.post, url,data,headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  // eslint-disable-next-line camelcase
  getOrderDetail = (orderId, user_id) => {
    // eslint-disable-next-line camelcase
    const url = `${API.url}/api/bookingProductDetail?booking_id=${orderId}&user_id=${user_id}`;
    const headers = APIManager.getHeader();
    return axios({method:API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error =>{throw error})
  };

  searchProductCategory = (data) => {
    const url = `${API.url}${API.searchProductCategory(data.index, data.numberPost, data.userId, data.key, data.category_id)}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getListProduct = (data) => {
    const url = `${API.url}${API.listProduct(data.user_id, data.category_id, data.index, data.number_post)}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getInfo = (userId) => {
    const url = API.url + API.getInfo(userId);
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => {
        const res = APIManager.getInstance().checkResponse(response);
        if(res !== null) {
          const {data} = res.data;
          if(res.data.errorId === 200) {
            APIManager.getInstance().setFirebaseLog(data);
          }
          const time = moment().locale("vi").format(format.ddddDDMMYYYYHHMMSS);
          APIManager.getInstance().sendPrivateLog('getInfo', {time, response});
        }
        return res;
      })
      .catch(error => {throw error})
  };

  getConfigs = () => {
    const url = `https://xengon.tech/api/config`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  getWorkShopAddress = () => {
    const url = `https://xengon.tech/api/address`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };

  checkPromotion = (data) => {
    const url = `${API.url}${API.checkPromotion(data.user_id, data.promotion_code, data.service_id)}`;
    const headers = APIManager.getHeader();
    return axios({method: API.requestType.get, url, headers})
      .then(response => APIManager.getInstance().checkResponse(response))
      .catch(error => {throw error})
  };
};
