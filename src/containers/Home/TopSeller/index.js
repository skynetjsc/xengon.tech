import React, { Component } from 'react';
import {Dimensions, View, StyleSheet, FlatList} from 'react-native';
import {TitleCategoriesHome, ItemProduct} from '../../../components';
import {IconTop, ImageProduct1} from '../../../styles/svg';

const {height, width} = Dimensions.get('screen');

class Index extends Component {

  goDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  renderItem = ({item, index}) => (
    <ItemProduct
      data={item}
      style={{marginLeft: index === 0 ? width*0.04 : 6}}
      handleButton={() => this.goDetail(item.id)}
    />
  );

  handleLoadMore = (data) => {
    this.props.navigation.navigate('AllProductScreen', {data})
  };

  render() {
    const title='BÁN CHẠY NHẤT';
    const {data} = this.props;
    return (
      <View>
        <TitleCategoriesHome icon={<IconTop />} title={title} left handleLoadMore={() => this.handleLoadMore(data)}  />
        <FlatList
          data={data}
          renderItem={this.renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={data.id}
        />
      </View>
    );
  }
}

export default Index;
