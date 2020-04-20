import React, { Component } from 'react';
import {View, Text, TouchableOpacity, Dimensions, StyleSheet} from 'react-native';
import { fontSize, fonts } from '../../styles';
import {NextSmall} from '../../styles/svg';

const {height, width} = Dimensions.get('screen');

class TitleCategoriesHome extends Component {
  render() {
    const {icon, title, left, handleLoadMore} = this.props;
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row', alignItems:'flex-end', height: width*0.1}}>
          <View style={{marginLeft: 15, marginRight: width*0.02}}>{icon}</View>
          <Text style={styles.textTitle}>{title}</Text>
        </View>

        {
          left? (
            <TouchableOpacity style={styles.button} onPress={handleLoadMore}>
              <Text style={styles.loadmore}>Xem hết</Text>
              <View style={{marginBottom: width*0.016}}>
                <NextSmall />
              </View>
            </TouchableOpacity>
          ) : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems:'flex-end',
    justifyContent:'space-between',
    height: width*0.1,
    marginBottom: width*0.03
  },
  textTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts.primaryBold,
    color: '#344356',
    justifyContent:'flex-end',
    letterSpacing: 1,
  },
  button:{
    // padding: width*0.03,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: width*0.1,
    marginRight: width*0.03
  },
  loadmore: {
    fontSize: fontSize.f13,
    color: '#797979',
    marginRight: width*0.01,
    fontFamily: fonts.primaryRegular
  }
});

export default TitleCategoriesHome;
