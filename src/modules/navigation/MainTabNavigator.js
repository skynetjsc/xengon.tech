/* eslint-disable import/no-unresolved */
import React from 'react';
import {View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

// colors, fonts , icon
import { colors, fonts } from '../../styles';
import {IconHome, IconHomeActive, IconActivityActive, IconActivity, IconStore, IconStoreActive, IconAccount, IconAccountActive} from "../../styles/svg"

// main screens
import HomeScreen from '../home/HomeView';
import ActivityScreen from '../activity/ActivityView';
import StoreScreen from '../store/StoreView';
import AccountScreen from '../account/AccountView';
import ProfileScreen from '../../containers/Profile';

// styles
const styles = StyleSheet.create({
  tabBarContainer: {
    height: 65,
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: '#EFEFF4',
    shadowColor: "#B09393",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 20,
    paddingVertical: 8,
  },
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.white,
    paddingHorizontal: 10,
  },
  tabBarIcon: {
    width: 23,
    height: 23,
  },
  tabBarIconFocused: {
    tintColor: colors.primary,
  },
  headerContainer: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    resizeMode: 'cover',
  },
  headerCaption: {
    fontFamily: fonts.primaryRegular,
    color: colors.white,
    fontSize: 18,
  },
});

// label tabbar bottom components
const TabBarLabel = props => {
  const{title,focused} = props;
  return (
    <Text
      style={{ fontSize: 14,
        color: focused ? colors.default : colors.lightGray,
        fontFamily: focused ? fonts.primaryBold : fonts.primaryRegular,
        textAlign: "center"
      }}
    >
      {title}
    </Text>
  )
};

// config tabbar bottom
export default createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (<TabBarLabel title="Trang chủ" focused={focused} />),
        // header: (<View />)
      },
    },
    Activity: {
      screen: ActivityScreen,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (<TabBarLabel title="Hoạt động" focused={focused} />),
      },
    },
    Store: {
      screen: StoreScreen,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (<TabBarLabel title="Cửa hàng" focused={focused} />),
      },
    },
    Account: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: ({ focused }) => (<TabBarLabel title="Tài khoản" focused={focused} />),
      },
    },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      // eslint-disable-next-line react/prop-types
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconSource;
        switch (routeName) {
          case 'Home':
            iconSource = focused ? <IconHomeActive /> : <IconHome />;
            break;
          case 'Activity':
            iconSource = focused ? <IconActivityActive /> : <IconActivity />;
            break;
          case 'Store':
            iconSource = focused ? <IconStoreActive /> : <IconStore />;
            break;
          case 'Account':
            iconSource = focused ? <IconAccountActive /> : <IconAccount />;
            break;
          default:
            iconSource = focused ? <IconHomeActive /> : <IconHome />;
        }
        return (
          <View style={styles.tabBarItemContainer}>
            {iconSource}
          </View>
        );
      },
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showLabel: true,
      style: styles.tabBarContainer,
    },
  },
)
