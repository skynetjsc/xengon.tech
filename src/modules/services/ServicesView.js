import React, {Component} from 'react';
import {
  StyleSheet,
  View, ScrollView, Text, FlatList, Alert, Dimensions,
} from 'react-native';
import ActivityIndicator from '../../components/View/ActivityIndicator';
import { connect } from "react-redux";

import { fonts, fontSize } from '../../styles';

import { ItemProduct, MultiplePlaceHolders, ButtonFrame } from '../../components';
import {HeaderDefault,TabsSelector, ListServices, ListImplementation} from "../../containers";

const {width} = Dimensions.get('screen');

const listSelect = [
  {
    title: "sedan",
  },
  {
    title: "suv & pickup",
  },
];

const title = {
  header: "Dịch vụ nội thất",
  relatedProduct: "Gợi ý  sản phẩm phù hợp tự chăm sóc",
  button: "LÊN LỊCH GÓI NÀY"
};

// const {width, height} = Dimensions.get("window");

class ServicesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexPackageSelected: 0,
      indexSelectorSelected: 0,
      listProductSelected: [],
      category: null,
      trend: null
    }
  }

  componentDidMount(): void {
      this.getData();
  }

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    const {trend, indexPackageSelected} = this.state;
    if(trend && indexPackageSelected === -1) {
      const {data} = nextProps.serviceDetail;
      if (data && data.length > 0) {
        const {id} = trend;
        for(let i = 0; i < data.length; i++) {
          if(data[i].id === id) {
            this.setState({indexPackageSelected:i});
            return false;
          }
        }
      }
    }
    return true;
  }

  getData = () => {
    const {category, trend} = this.props.navigation.state.params;
    if (trend
      && Object.hasOwnProperty.call(trend, 'category_id')
      && Object.hasOwnProperty.call(trend, 'car_type_id')) {
      this.setState({category, trend, indexSelectorSelected: trend.car_type_id === "2" ? 0 : 1, indexPackageSelected: -1});
      this.props.getApiCategoryDetail(trend.category_id, trend.car_type_id);
    } else if (category) {
      this.setState({category});
      this.props.getApiCategoryDetail(category.id, "2");
    }
  };

  onTapSelector = (index) => {
    const {category} = this.props.navigation.state.params;
    this.setState({indexSelectorSelected: index, indexPackageSelected: 0});
    if (category) {
      if (index === 0) {
        this.props.getApiCategoryDetail(category.id, "2");
      }
      if (index === 1) {
        this.props.getApiCategoryDetail(category.id, "1");
      }
    }
  };

  onTapSelectPackage = (index) => {
    this.setState({indexPackageSelected: index, listProductSelected: []});
  };

  backHome = () => this.props.navigation.navigate('Home');

  onPresentToConfirm = () => {
    const {data} = this.props.serviceDetail;

    const {listProductSelected,category} = this.state;
    const {indexPackageSelected} = this.state;
    if(indexPackageSelected === -1) {
      return;
    }
    // if (listProductSelected.length > 0) {
    //   data[indexPackageSelected].listProductSelected = listProductSelected;
    // }
    const priceService = data[indexPackageSelected].price;
    data[indexPackageSelected].priceAddedProduct = priceService;
    if (listProductSelected.length > 0) {
      data[indexPackageSelected].listProductSelected = listProductSelected;
      if (parseFloat(priceService)) {
        let totalPrice = parseFloat(priceService);
        listProductSelected.map((item) => {
          if (item.price_discount && parseFloat(item.price_discount)) {
            totalPrice += parseFloat(item.price_discount)
          } else if (item.price && parseFloat(item.price)) {
            totalPrice += parseFloat(item.price)
          }
        });

        data[indexPackageSelected].priceAddedProduct = totalPrice.toString();
      }
    }

    data && data.length > 0?
      this.props.navigation.navigate("ServicesConfirmStep",{serviceDetail: data[indexPackageSelected], category})
      :
      Alert.alert(
        "Thông báo",
        "Không có dữ liệu",
        [{text: "OK", onPress: this.backHome}])
  };

  onPressBack = () => {
    this.props.navigation.goBack();
  };

  renderItemProduct = ({ item, index }) => {
    const number = item.hasOwnProperty("number") && parseInt(item.number) ? parseInt(item.number) : 0;
    return (
      <ItemProduct
        data={item}
        style={{ marginLeft: index === 0 ? fontSize.f22 : 6 }}
        select={number > 0}
        listProduct={this.state.listProductSelected}
        handleButton={() => this.goProductDetail(item.id)}
      />
    )
  };

  goProductDetail = (productId) => {this.props.navigation.navigate("ProductDetail", {productId})};

  render() {
    const {data, isFetching} = this.props.serviceDetail;
    const {indexPackageSelected,indexSelectorSelected,loadingSelector,loadingPackages,loadingImplementation,category} = this.state;
    const listProduct = data && data.length > 0 && indexPackageSelected >= 0 && data[indexPackageSelected].list_product ? data[indexPackageSelected].list_product : [];
    return (
      <View style={{flex: 1}}>
        {
          isFetching?
            (
              <View style={{justifyContent: 'center', alignContent: 'center', flex: 1}}>
                <ActivityIndicator style={{flex:1}} visible />
              </View>
            )
            :
            (
              <View style={styles.container}>
                <HeaderDefault
                  title={category ? category.content : ""}
                  onPressBack={this.onPressBack}
                />
                <View style={{flex: 1}}>
                  <ScrollView showsVerticalScrollIndicator={false} style={{paddingTop: width*0.02}}>
                    <View style={{flex: 1}}>
                      <TabsSelector
                        listSelect={listSelect}
                        onPress={this.onTapSelector}
                        indexSelectorSelected={indexSelectorSelected}
                        loadingSelector={loadingSelector}
                      />
                      <ListServices
                        packages={data}
                        indexPackageSelected={indexPackageSelected}
                        onPress={this.onTapSelectPackage}
                        loadingPackages={loadingPackages}
                      />
                      <ListImplementation
                        listProcess={data && data.length > 0 && data[indexPackageSelected].process}
                        loadingImplementation={loadingImplementation}
                      />
                      {
                    listProduct.length > 0 && (
                      <View>
                        <Text style={styles.headerTitle}>{title.relatedProduct}</Text>
                        <FlatList
                          style={{ paddingBottom: 20 }}
                          data={listProduct}
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          keyExtractor={(item) => item.id}
                          renderItem={this.renderItemProduct}
                        />
                      </View>
                    )}
                    </View>
                    <ButtonFrame
                      title={title.button}
                      style={{marginBottom: 40, marginHorizontal: fontSize.f22}}
                      onPress={this.onPresentToConfirm}
                    />
                  </ScrollView>
                </View>
              </View>
            )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F8",
  },
  headerTitle: {fontFamily: fonts.primaryBold, fontSize: 16, marginLeft: fontSize.f22, marginBottom: 10}
});

const mapStateToProps = (state) => ({
    serviceDetail: state.ServiceDetailReducer,
    app: state.app,
  });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/ServiceDetailRedux");

  return {
    ...ownProps,
    ...stateProps,
    getApiCategoryDetail: (categoryId, carTypeId) => actions.getApiCategoryDetail(dispatch,categoryId, carTypeId),
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(ServicesView);
