import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard, Text, FlatList, ScrollView } from 'react-native';

import HeaderDefault from '../../containers/Header/HeaderDefault';
import { ItemProduct, TextInputFrame } from '../../components';
import { colors, fonts, fontSize } from '../../styles';
import { IconDot2, IconNextSmall, IconNotFound } from '../../styles/svg';
import APIManager from '../../helpers/APIManager';
import LoadMore from '../../helpers/LoadMoreManager';
import { connect } from 'react-redux';
import ActivityIndicator from '../../components/View/ActivityIndicator';

const { width} = Dimensions.get('screen');


class ShopItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        index: LoadMore.index,
        numberPost: LoadMore.numberPost,
        userId: this.props.app.profile.id,
        key: "",
      },
      nameCategory: "",
      listProduct: [],
      category: [],
      loading: false,
      focus: false,
      total: LoadMore.total,
    };

    this.isSearchCategory = false
  }

  componentDidMount(): void {
    const dataPage = this.props.navigation.getParam("dataPage");
    const check = this.props.navigation.getParam("check");
    //console.log(dataPage);
    if (dataPage) {
      this.setState({loading: true, data:dataPage});
      if(check) {
        this.getListProduct(dataPage)
      }else {
        this.callSearchProductAPI(dataPage);
      }
    }
  }

  callSearchProductAPI= (data, isLoadMore=false) => {
    APIManager.getInstance().searchProduct(data)
      .then(res => {
        const {list,total} = res.data.data;
        const {listProduct} = this.state;
        let emptyList = [];
        if (isLoadMore) {
          emptyList = [...listProduct, ...list];
        } else {
          emptyList = list;
        }
        this.setState({listProduct: emptyList,total,loading: false,focus: false});
        if (data.hasOwnProperty("category_id")) {
          this.getNameCategory(data.category_id);
        }
      })
      .catch(err => {
        this.setState({loading: false,focus: false});
        //console.log(err)
      });
  };

  getListProduct = async (data, isLoadMore=false) => {
    const categories = this.props.category.data;
    APIManager.getInstance().getListProduct(data)
      .then(res => {
        const {list,total} = res.data.data;
        const {listProduct} = this.state;
        let emptyList = [];
        if (isLoadMore) {
          emptyList = [...listProduct, ...list];
        } else {
          emptyList = list;
        }
        this.setState({listProduct: emptyList,total,loading: false,focus: false});
        if (data.hasOwnProperty("category_id")) {
          const category = categories.map(item => {
            if(item.id === data.category_id){
              this.setState({category: item})
            }
          });
        }
      })
      .catch(err => {
        this.setState({loading: false,focus: false});
        //console.log(err)
      });
  };

  getNameCategory = async (category_id) => {
    const {data} = this.props.category;
    const category = await data.map(item => {
      item.sub_category.map(i => {
        if(i.id === category_id){
          this.setState({
            nameCategory: i.name,
            category: item,
          });
        }
      })
    });
  };

  handleLoadMore = () => {
    const {check} = this.props.navigation.state.params;
    const {data,total} = this.state;
    const {numberPost,index} = data;
    data.index = index + LoadMore.numberPost;
    data.numberPost = numberPost;
    if (data.index < total) {
      if(check){
        this.getListProduct(data, true);
      }else {
        this.callSearchProductAPI(data, true);
      }
    }
  };

  onEndEditing = () => {
    const {data} = this.state;
    data.index = LoadMore.index;
    data.numberPost = LoadMore.numberPost;
    if(data.key) {
      this.callSearchProductAPI(data);
    } else {
      this.setState({
        focus: false,
      });
    }
  };

  onChangeText = text => {
    const {data} = this.state;
    data.key = text;
    this.setState({data});
  };

  onFocus = () => {
    const {data} = this.state;
    data.key = "";
    this.setState({
      focus: true
    });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  goDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  renderItem = ({item, index}) => (
    <ItemProduct
      data={item}
      style={{width: width*0.4267, marginHorizontal: width*0.02}}
      handleButton={() => this.goDetail(item.id)}
    />
  );

  goCart = () => {this.props.navigation.navigate('Cart')};

  render() {
    const {listProduct, focus, category, nameCategory} = this.state;
    const textSearch = this.state.data.key;
    //console.log(textSearch);
    const dataPage = this.props.navigation.getParam("dataPage");
    const {data} = this.props.cart;
    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.container}>
          <HeaderDefault
            title='Danh mục sản phẩm'
            isHaveMiniCart
            countProduct={data && data.list_product && data.list_product.length}
            onPressBack={this.goBack}
            onPressIconRight={this.goCart}
          />
          <ScrollView style={{paddingTop: 20}} showsVerticalScrollIndicator={false}>
            {
              this.state.loading?
                (
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <ActivityIndicator style={{flex:1}} visible />
                  </View>
                )
                :
                (
                  <View style={{marginLeft: width*0.045, flex: 1}}>
                    <TextInputFrame
                      defaultValue={textSearch}
                      placeholder='Từ khóa tìm kiếm'
                      onChangeText={this.onChangeText}
                      onEndEditing={this.onEndEditing}
                      onFocus={this.onFocus}
                      value={this.state.data.key}
                    />
                    {
                      listProduct &&listProduct.length > 0 ?
                        (
                          <View style={{opacity: focus? 0.2: 1}}>
                            {
                              dataPage.category_id?
                                (
                                  <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: width*0.07}}>
                                    <IconDot2 />
                                    <Text style={[styles.text,{marginHorizontal: width*0.02}]}>{category.name}</Text>
                                    <IconNextSmall color='#00BBDC' />
                                    <Text style={[styles.text, {marginLeft: width*0.02}]}>{nameCategory}</Text>
                                  </View>
                                ) : null
                            }
                            <View style={{marginLeft: -width*0.015, paddingTop: dataPage.category_id?0: width*0.03}}>
                              <FlatList
                                data={listProduct}
                                extraData={listProduct}
                                renderItem={this.renderItem}
                                numColumns={2}
                                contentContainerStyle={{paddingBottom:dataPage.category_id?width*0.6: width*0.32}}
                                showsVerticalScrollIndicator={false}
                                onEndReachedThreshold={0.4}
                                onEndReached={this.handleLoadMore}
                                keyExtractor={(item, index) => index.toString()}
                              />
                            </View>
                          </View>
                        )
                        :
                        (
                          <View style={{justifyContent: 'center', alignItems: 'center', marginTop: width*0.3, opacity: focus? 0.2: 1}}>
                            <View style={styles.containerNotFound}>
                              <IconNotFound />
                              <Text style={styles.textHeaderNotFount}>Rất tiếc</Text>
                            </View>
                            <Text style={styles.textFooterNotFound}>Sản phẩm bạn đang tìm hiện không tồn tại</Text>
                            <Text style={styles.textFooterNotFound}> trên hệ thống.</Text>
                          </View>
                        )
                    }
                  </View>
                )
            }
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.defaultBackgroundColor
  },
  text: {
    fontSize: fontSize.f16,
    fontFamily: fonts.primaryBold,
    letterSpacing: 1,
  },
  textHeaderNotFount : {
    marginTop: width*0.02,
    fontSize: fontSize.f30,
    fontFamily: fonts.primaryBold,
    color: colors.orange,
  },
  textFooterNotFound: {
    fontSize: fontSize.f16,
    fontFamily: fonts.primaryRegular,
    color: colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  containerNotFound: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: width*0.05
  }
});

const mapStateToProps = (state) => ({
  shop: state.ShopReducer,
  app: state.app,
  category: state.CategoryProductReducer,
  cart: state.CartReducer
});

export default connect(
  mapStateToProps,
  undefined,
  null
)(ShopItems);
