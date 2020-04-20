import React from 'react';
import { Platform } from 'react-native';

// import AuthScreen from '../containers/AuthScreen';
import AppNavigator from './RootNavigation';
// import Introduction from '../introductions/Introduction';

export default function NavigatorView() {
  // if (authState.isLoggedIn || authState.hasSkippedLogin) {
  //     return <AppNavigator />;
  // }
  // return <AuthScreen />;

  // const prefix = 'xengonapp://';
  const prefix = Platform.OS === 'android' ? 'xengonapp://xengonapp/' : 'xengonapp://';
  return <AppNavigator uriPrefix={prefix} />;
  // return <Introduction />;
}
