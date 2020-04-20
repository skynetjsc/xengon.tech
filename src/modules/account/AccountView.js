import React, {Component} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { connect } from "react-redux";
import { ButtonNotification } from '../../containers';

class AccountView extends Component {
  goNotification = () => {
    this.props.navigation.navigate('Notifications');
  };
  render() {
    return (
      <View style={styles.container}>
        <ButtonNotification
          countNotify={3}
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

export default connect()(AccountView);
