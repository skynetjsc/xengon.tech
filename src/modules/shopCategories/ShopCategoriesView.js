import React, { Component } from 'react';
import {View, Dimensions, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';

import { colors } from '../../styles';
import {TextInputFrame} from '../../components';

import HeaderDefault from '../../containers/Header/HeaderDefault';
import Body from './Body';
import { connect } from 'react-redux';
import APIManager from '../../helpers/APIManager';
import LoadMore from '../../helpers/LoadMoreManager';

const {height, width} = Dimensions.get('screen');

class ShopCategoriesView extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: {
        index: LoadMore.index,
        numberPost: LoadMore.numberPost,
        userId: this.props.app.profile.id,
        key: "",
      },
    }
  }

  componentDidMount() {
    this.props.getCategoryProduct();
  }

  onPressBack = () => {
    this.props.navigation.goBack();
  };


  onChangeText = text => {
    const {data} = this.state;
    data.key = text;
    this.setState({data});
  };


  onEndEditing = () => {
    const {data} = this.state;
    const dataPage = Object.assign({}, data);
    data.index = LoadMore.index;
    data.numberPost = LoadMore.numberPost;
    if(data.key !== ""){
      data.key = "";
      this.setState({focus: false, data}, () => {
        this.props.navigation.navigate("ShopItems", {dataPage});
      })
    } else {
      this.setState({
        focus: false,
      });
    }
  };

  onFocus = () => {
    this.setState({
      focus: true,
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
          <HeaderDefault
            title='Danh mục sản phẩm'
            onPressBack={this.onPressBack}
          />
          <View style={{marginLeft: width*0.045, flex: 1}}>
            <TextInputFrame
              placeholder='Nhập từ khóa tìm kiếm'
              onChangeText={this.onChangeText}
              onEndEditing={this.onEndEditing}
              onFocus={this.onFocus}
              value={this.state.data.key}
            />
            {
              this.props.categoryProduct.data && (
                <Body
                  // handleButton={this.goShopItems}
                  contents={this.props.categoryProduct.data}
                  navigation={this.props.navigation}
                  profile_id={this.props.app.profile.id}
                />
              )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    app: state.app,
    categoryProduct: state.CategoryProductReducer
  };
};


function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/GetCategoryProductRedux");
  return {
    ...ownProps,
    ...stateProps,
    getCategoryProduct: () => actions.getCategoryProduct(dispatch),
  };
}


export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ShopCategoriesView);

