import React, { Component } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import {ItemNews, TitleCategoriesHome} from '../../../components';
import {IconIdea} from '../../../styles/svg';
import { connect } from 'react-redux';

const {height, width} = Dimensions.get('screen');

class Index extends Component {

  constructor(props) {
    super(props);
  }

  renderItem = ({item, index}) => (
    <ItemNews
      data={item}
      style={{marginLeft: index === 0 ? width*0.04 : 6}}
      onBlogDetail={() => this.onBlogDetail(item)}
    />
  );

  onBlogDetail = (item) => {
    this.props.navigation.navigate("BlogDetail", {blogDetail: item});
  };

  render() {
    const {blogs} = this.props.homeBlog;
    if (blogs && blogs.length > 0) {
      return (
        <View style={{marginTop: width*0.03}}>
          <TitleCategoriesHome icon={<IconIdea />} title='BLOG XE NGON' />
          <FlatList
            data={blogs}
            renderItem={this.renderItem}
            horizontal
            keyExtractor={(item) => `${item.id}`}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      );
    }

    return null
  }
}

const mapStateToProps = (state) => ({
    homeBlog: state.HomeBlogReducer,
  });

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;

  return {
    ...ownProps,
    ...stateProps,
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(Index);
