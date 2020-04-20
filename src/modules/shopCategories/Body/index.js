import React, { Component } from 'react';
import {View, Dimensions, ScrollView, StyleSheet,  FlatList, Text, TouchableOpacity} from 'react-native';
import DropDownItem from "react-native-drop-down-item";

import { fonts, fontSize } from '../../../styles';
import {IconNextSmall} from '../../../styles/svg';
import LoadMore from '../../../helpers/LoadMoreManager';

const {height, width} = Dimensions.get('screen');

class Index extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     contents: [],
  //   };
  // }

  // componentDidMount(): void {
  //   this.getCategory();
  // }

  // getCategory = () => {
  //   APIManager.getInstance().getCategory()
  //     .then(res => {
  //       this.setState({contents: res.data.data});
  //       console.log("category: ", this.state.contents);
  //     })
  //     .catch(err => console.log(err));
  // };

  renderItem = ({item}) => {
    const {profile_id} = this.props;
    return (
      <TouchableOpacity
        style={[styles.button, {marginBottom: width*0.04}]}
        onPress={() =>this.goShopItems(profile_id, item.id)}
      >
        <Text style={styles.txt}>{item.name}</Text>
        <IconNextSmall />
      </TouchableOpacity>
    )
  };

  goShopItems = (profile_id, category_id) => {
    const data = {
      index: LoadMore.index,
      numberPost: LoadMore.numberPost,
      userId: profile_id,
      key: "",
      category_id
    };
    this.props.navigation.navigate('ShopItems', {dataPage: data});
  };

  render() {
    const {contents} = this.props;
    return (
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {
            contents
              ? contents.map((param) => (
                <DropDownItem
                  key={param.id}
                  contentVisible={false}
                  header={(
                    <View>
                      <Text style={styles.title}>{param.name}</Text>
                    </View>
                  )}
                >
                  <FlatList
                    data={param.sub_category}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={item => `${item.id}`}
                  />
                </DropDownItem>
              ))
              : null
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: width*0.08
  },
  header: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.f20,
    fontFamily: fonts.primaryBold,
  },
  button: {
    width: width*0.87,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txt: {
    fontSize: fontSize.f16,
    fontFamily: fonts.primaryRegular
  }
});

export default Index;
