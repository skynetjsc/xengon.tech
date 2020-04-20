import React, { Component } from 'react';
import {View, Dimensions, StyleSheet, StatusBar,} from 'react-native';
import {ViewProfile} from '../index';
import { colors } from '../../styles';

const {height, width} = Dimensions.get('screen');

class HeaderHome extends Component {
  render() {
    const {profile, content} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
        <StatusBar
          hidden={false}
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.header} />
        <View style={styles.content}>
          {content}
        </View>
        <View style={{position: 'absolute', top: width*0.22 }}>
          <ViewProfile background data={profile} navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    width,
    height: width*0.49 ,
    backgroundColor: '#00BBDC',
    borderBottomRightRadius: width*0.06,
    borderBottomLeftRadius: width*0.06
  },
  content:{
    marginTop: width*0.05,
    minHeight: height-width*0.7,
  }
});

export default HeaderHome;
