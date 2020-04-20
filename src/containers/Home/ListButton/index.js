import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { fontSize, fonts } from '../../../styles';

const {width} = Dimensions.get('screen');

class Index extends Component {
  onPressButton = (category) => {
    //console.log(category);
    this.props.navigation.navigate('Services', {category})
  };

  renderViewButton = ({item}, style) => (
    <View style={{alignItems: 'center', width: width*0.25, ...style}}>
      <TouchableOpacity style={styles.viewButton} onPress={() => this.onPressButton(item)}>
        <Image source={{uri: item.img}} style={{height:width*0.16, width: width*0.17, borderRadius: width*0.04}} />
      </TouchableOpacity>
      <Text style={{fontSize: fontSize.f13, fontFamily: fonts.primarySemiBold, color:'#4A4A4A'}}>{item.name}</Text>
    </View>
  );

  render() {
    const {data} = this.props;
    return (
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderViewButton}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={data.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewButton: {
    height: width*0.17,
    width: width*0.17
  },
  container: {
    flexDirection: 'row',
    marginRight: 5,
    justifyContent: 'space-around'
  }
});

export default Index;
