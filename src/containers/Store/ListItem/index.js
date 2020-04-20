import React, { Component } from 'react';
import {Dimensions, View, StyleSheet, FlatList} from 'react-native';
import {TitleCategoriesHome, ItemProduct} from '../../../components';
import {IconTop, ImageProduct1} from '../../../styles/svg';

const {height, width} = Dimensions.get('screen');

class Index extends Component {
  handleLoadMore = (data, titleHeader) => {
    this.props.navigation.navigate('AllProductScreen', {data, titleHeader})
  };

  goDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  renderItem = ({item, index}) => (
    <ItemProduct
      data={item}
      style={{marginLeft: index === 0 ? width*0.04 : 6}}
      handleButton={() => this.goDetail(item.id)}
    />
  );

  render() {
    const {nameCategories, data, titleHeader} = this.props;
    return (
      <View>
        <TitleCategoriesHome icon={<IconTop />} title={nameCategories} left handleLoadMore={() =>this.handleLoadMore(data, titleHeader)} />
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

export default Index;
