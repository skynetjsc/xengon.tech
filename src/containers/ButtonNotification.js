import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text, Dimensions,
} from 'react-native';

import {BtnNotification} from "../styles/svg"
import { colors, fonts } from '../styles';
import { connect } from 'react-redux';

const {height} = Dimensions.get("window");

class ButtonNotification extends React.Component {
  render() {
    const {onPress,style, countNotify} = this.props;

    return (
      <TouchableOpacity
        accessibilityTraits="button"
        onPress={onPress}
        activeOpacity={0.8}
        style={[styles.buttonContainer, style]}
      >
        <BtnNotification />
        <View style={{ ...styles.viewRadius, opacity: countNotify > 0 ? 1 : 0 }}>
          <Text style={{
            ...styles.textNotify,
            paddingHorizontal: countNotify > 9 ? 2 : 4.25,
            paddingVertical: countNotify > 9 ? 1 : 0
          }}
          >
            {countNotify}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: height*0.01,
    right: 20,
    shadowColor: "#F67E8D",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20
  },
  viewRadius: {
    position: "absolute",
    right: 15,
    top: 17,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: "red",
    borderRadius: 30
  },
  textNotify: {
    fontSize: 11,
    color: colors.white,
    fontFamily: fonts.primaryBold
  }
});
const mapStateToProps = (state) => ({
  app: state.app,
  notifications : state.NotificationReducer
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../redux/NotificationRedux");

  return {
    ...ownProps,
    ...stateProps,
    getNotification: (userId) => actions.getApiNotification(dispatch,userId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ButtonNotification);
