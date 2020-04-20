import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from 'react-native-splash-screen';
import codePush from "react-native-code-push";
import firebase from 'react-native-firebase';
import moment from 'moment';
import { colors } from './src/styles';
import NotificationManager from "./src/helpers/NotificationManager"
import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';
import format from './src/styles/format';
import APIManager from './src/helpers/APIManager';


const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
  minimumBackgroundDuration: 2 * 60
};

class App extends React.Component {

  constructor() {
    super();
    this.state = {};
    firebase.analytics().setAnalyticsCollectionEnabled(true);
    const time = moment().locale("vi").format(format.ddddDDMMYYYYHHMMSS);
    APIManager.getInstance().sendPrivateLog('appStart', {time});
    firebase.analytics().logEvent('AppStart', {time} );
  }

  async componentDidMount(): void {
    // NotificationManager.getInstance().checkPermission();
    NotificationManager.getInstance().createNotificationListeners();
    SplashScreen.hide();
  }

  componentWillUnmount(): void {
    // NotificationManager.getInstance().notificationListener();
    // NotificationManager.getInstance().notificationOpenedListener();
  }



  render() {
    return (
      <Provider store={store}>
        <PersistGate
          loading={
            // eslint-disable-next-line react/jsx-wrap-multilines
            <View style={styles.container}>
              <ActivityIndicator color={colors.red} />
            </View>
          }
          persistor={persistor}
        >
          <AppView />
        </PersistGate>
      </Provider>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

// eslint-disable-next-line no-class-assign
App = codePush(codePushOptions)(App);
export default App;
