import React, { PureComponent } from 'react';
import { Dimensions, View, StyleSheet, FlatList, Text,} from 'react-native';
import {TitleCategoriesHome, ButtonShadow } from '../../../components';
import { FireIcon } from '../../../styles/svg';
import { fontSize, fonts } from '../../../styles';
import APIManager from "../../../helpers/APIManager";
import {connect} from "react-redux";
import LoadMore from "../../../helpers/LoadMoreManager";


const {height, width} = Dimensions.get('screen');

class Index extends PureComponent {

  loadAllProduct = (category_id) => {
    const {profile} = this.props.app;
    const data = {
      number_post: LoadMore.numberPost,
      category_id: category_id,
      user_id: profile.id,
      index: LoadMore.index
    };

    this.props.navigation.navigate("ShopItems", {dataPage: data, check: "1"})
  };

  renderItem = ({item, index}) => (
    <ButtonShadow
      extendStyle={[styles.button, {marginLeft: index === 0? width*0.04 : 6}]}
      onPress={() => this.loadAllProduct(item.id)}
    >
      <Text style={styles.textButton}>{item.name}</Text>
    </ButtonShadow>
  );

  handleLoadMore = () => {
    this.props.navigation.navigate('ShopCategories')
  };

  render() {
    const {data} = this.props;
    return (
      <View>
        <TitleCategoriesHome icon={<FireIcon />} title='DANH MỤC' left handleLoadMore={this.handleLoadMore} />
        <FlatList
          data={data}
          renderItem={this.renderItem}
          horizontal
          howsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
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

const mapStateToProps = (state) => ({
  shop: state.ShopReducer,
  app: state.app,
});


export default connect(
  mapStateToProps,
  undefined,
  null
)(Index);
