import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Dimensions, View, StyleSheet, FlatList, Text} from 'react-native';
import {TitleCategoriesHome, ButtonShadow } from '../../../components';
import { FireIcon } from '../../../styles/svg';
import { fontSize, fonts } from '../../../styles';


const {width} = Dimensions.get('screen');

class Index extends Component {

  renderItem = ({item, index}) => (
    <ButtonShadow
      extendStyle={[styles.button, {marginLeft: index === 0? width*0.04 : 6}]}
      onPress={() => this.goServices(item)}
    >
      <Text style={styles.textButton}>{item.name}</Text>
    </ButtonShadow>
  );

  goServices = (item) => {
    const {onPressTrend} = this.props;
    if(onPressTrend) {
      onPressTrend(item);
    }
    // this.props.navigation.navigate('Services',{trend:item})
  };

  handleLoadMore = () => {

    const {onPressLoadMore} = this.props;
    if(onPressLoadMore) {
      onPressLoadMore();
    }
    // this.props.navigation.navigate('ShopCategories')
  };

  render() {
    const {data} = this.props;
    return (
      <View>
        <TitleCategoriesHome icon={<FireIcon />} title='XU HƯỚNG' />
        <FlatList
          data={data}
          renderItem={this.renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    // maxWidth: width*0.28,
    minWidth: width*0.26,
    height: width*0.1,
    paddingHorizontal: width*0.02,
    borderRadius: width*0.04,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width*0.02,
    marginBottom: width*0.06,
    marginTop: 2
  },
  textButton: {fontSize: fontSize.f13, color: '#424243', fontFamily: fonts.primarySemiBold}
});

export default Index;
