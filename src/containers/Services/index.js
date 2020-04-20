import React from 'react';
import {
  StyleSheet, Dimensions, FlatList, View,
} from 'react-native';

import ServicePackageItems from './ServicePackageItems'
import {MultiplePlaceHolders} from "../../components"

const {width} = Dimensions.get("window");

const ListServices = props => {
  const {packages,indexPackageSelected,onPress,loadingPackages} = props;
  const renderItem = ({item, index}) => (
    <ServicePackageItems
      packages={item}
      isSelect={index === indexPackageSelected && true}
      onPress={() => onPress(index)}
    />
  );

  return (
    <View>
      {
        !loadingPackages && packages ? (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.listContainer}
            data={packages}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
          />
        ) : (
          <MultiplePlaceHolders />
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginLeft: width*0.053 - 8
  },
});

export default ListServices;
