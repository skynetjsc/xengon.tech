import React from 'react';
import firebase from 'react-native-firebase';
import {
  Alert,
  Platform,
  AsyncStorage, Linking,
} from 'react-native';
import APIManager from "./APIManager";

export default class NotificationManager {
  static myInstance = null;

  constructor() {
    // this.hasNewToken = this.hasNewToken.bind(this);
    // this.mRegisteredHandler = [];
    // this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
    //   // Process your token as required
    //   // AsyncStorage.setItem('FCM_TOKEN', fcmToken, () => {
    //   //   this.hasNewToken(fcmToken);
    //   //   this.updateTokenToServer();
    //   // });
    // });
    // this.setNotificationObserver = this.setNotificationObserver.bind(this);
    // this.removeNotificationObserver = this.removeNotificationObserver.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
    this.getToken = this.getToken.bind(this);
    // this.updateTokenToServer = this.updateTokenToServer.bind(this);
    // this.hasNewToken = this.hasNewToken.bind(this);
    this.requestPermission = this.requestPermission.bind(this);
    // this.requestPermission = this.requestPermission.bind(this);
    this.createNotificationListeners = this.createNotificationListeners.bind(this);
    // this.showAlert = this.showAlert.bind(this);

  }

  /**
   * @returns {NotificationManager}
   */
  static getInstance():NotificationManager {
    if (NotificationManager.myInstance == null) {
      NotificationManager.myInstance = new NotificationManager();
      // NotificationManager.myInstance.createNotificationListeners();
    }

    return this.myInstance;
  }

  checkPermission(userId) {
    firebase.messaging().hasPermission().then(enabled => {
      if (enabled) {
        this.getToken(userId);
      } else {
        this.requestPermission(userId);
        AsyncStorage.setItem('requestNotificationPermission', "1").then(() => {
          //console.log("save success")
        });
      }
    });
  }

  getToken(userId) {
    firebase.messaging().getToken().then(fcmToken => {
      if (fcmToken) {
        // user has a device token
        // console.log("fcmToken: ", fcmToken);
        AsyncStorage.getItem('FCM_TOKEN').then(oldToken => {
          // console.log(oldToken);
          // if(fcmToken !== oldToken) {
          AsyncStorage.setItem('FCM_TOKEN', fcmToken).then(() => {
            this.updateTokenFCM(userId,fcmToken);
          });
          // }
        });
      }
    });
  }

  updateNotification = (userId,is_noty) => {
    const bodyFormData = new FormData();
    bodyFormData.append('user_id', userId);
    bodyFormData.append('is_noty', is_noty);
    APIManager.getInstance().updateNotification(bodyFormData)
      .then(res => {
        //console.log("Update Notification", res);
      })
      .catch((error) => {
        //console.log(error);
      })
  };

  updateTokenFCM = (userId,fcmToken) => {
    const bodyFormData = new FormData();
    bodyFormData.append('user_id', userId);
    bodyFormData.append('token_fcm', fcmToken);
    APIManager.getInstance().updateToken(bodyFormData)
      .then(res => {
        //console.log("Post FCMToken ", res);
      })
      .catch((error) => {
      //console.log(error);
    })
  };

  async requestPermission(userId) {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken(userId);
    } catch (error) {
      // User has rejected permissions
      // alert("Bạn đã tắt quyền nhận thông báo từ xe ngon, vui lòng chỉnh lại trong cài đặt");
      //console.log('permission rejected');
      this.updateNotification(userId,0);
    }
  }

  handleNotification = (notification) => {
    // const { data } = notification;
    const prefix = Platform.OS === 'android'
      ? 'xengonapp://xengonapp/main/'
      : 'xengonapp://main/';
    const url = `${prefix}notifications`;

    Linking.openURL(url).catch(err => {/*console.error(err)*/});
    // console.log(notification.data);
    // if (notification.data.path) {
    //   Linking.openURL(url).catch(err => console.error(err));
    //   // firebase.messaging().setBadgeNumber(0);
    // }
  };

  async createNotificationListeners() {

    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      // const { title, body } = notification;
      // this.showAlert(title, body);
      //console.log("onNotification");
      notification.setSound("default");
      const channel = new firebase.notifications.Android.Channel(
        'xengon-chanel',
        'xengon Chanel',
        firebase.notifications.Android.Importance.Max
      ).setDescription('This is Xengon Chanel');
      firebase.notifications().android.createChannel(channel);

      if (Platform.OS === 'android') {
        const localNotification = new firebase.notifications.Notification({
          sound: 'default',
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .android.setChannelId('xengon-chanel') // e.g. the id you chose above
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => {/*console.error(err);*/});

      } else if (Platform.OS === 'ios') {
        const localNotification = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setSubtitle(notification.subtitle)
          .setBody(notification.body)
          .setData(notification.data)
          .ios.setBadge(notification.ios.badge);

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => {/*console.error(err);*/});

      }
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      // const { notification } = notificationOpen.notification;
      //console.log("onNotificationOpened");
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const {notification} = notificationOpen;
      // console.log(action,notificationOpen);
      this.handleNotification(notification)
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      //console.log("getInitialNotification");
      const { title, body } = notificationOpen.notification;
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const {notification} = notificationOpen;
      // firebase.notifications().setBadge(0);
      this.handleNotification(notification)
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      // console.log(JSON.stringify(message));
      //console.log(message);
    });
  }
}
