import React, { PureComponent } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { IconSuccess, IconOval, IconDelete } from '../../../styles/svg';
import { ViewShadow } from '../../../components';
import { colors, commonStyle, fonts, fontSize } from '../../../styles';
import { scale } from 'react-native-size-matters';
import Svg from 'react-native-svg';

const {width, height} = Dimensions.get("window");

class AddressItem extends PureComponent {
  onPress = () => {
    const {address, selected, onPress} = this.props;
    if(!selected) {
      onPress(address);
    }
  };


  render() {
    const {address, phone, selected, handleDelete} = this.props;

    const selectedView = selected? (
      <View style={styles.selectedView}>
        <IconSuccess style={styles.selectedIcon} />
      </View>
    ): (
      <View style={styles.selectedView}>
        <IconOval style={styles.selectedIcon} />
      </View>
    );
    return (
      <TouchableOpacity disabled={selected} onPress={this.onPress}>
        <ViewShadow style={[styles.common]}>
          <Text style={[commonStyle.h4]}>Địa chỉ</Text>
          <View
            style={{flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}
          >
            <Text numberOfLines={1} style={styles.addressDetail}>{address}</Text>
          </View>
          <Text style={styles.phone}>{phone}</Text>
          {selectedView}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0, top: 0,
              height: scale(40),
              width: scale(40),
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => handleDelete(address)}
          >
            <IconDelete width={scale(16)} height={scale(20*16/18)} />
          </TouchableOpacity>
        </ViewShadow>
      </TouchableOpacity>
    )
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F3F8",
  },
  common: {
    marginVertical: 7.5,
    marginHorizontal: 15,
    padding: 15
  },
  addressDetail: {
    fontFamily: fonts.primarySemiBold,
    marginVertical: 5,
    maxWidth: width*0.75
  },
  phone: {color: colors.red, fontFamily: fonts.primaryBold},
  btnAddNew: {flexDirection: "row", alignItems: "center"},
  btnTitle: {marginLeft: 5, fontSize: fontSize.f16, fontFamily: fonts.primarySemiBold},
  textInput: {minHeight: 50, fontSize: fontSize.f15, marginTop: 5},
  payment: {flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  paymentTitle: {fontSize: fontSize.f16, color: colors.darkBlueGray},
  paymentValue: {fontSize: fontSize.f16, fontFamily: fonts.primaryBold, color: colors.defaultBgButton},
  containerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: width*0.4,
    width: width*0.94,
    backgroundColor: colors.defaultBackgroundColor,
    marginLeft: -width*0.02,
    borderRadius: width*0.04,
  },
  selectedView:{
    position:'absolute',
    bottom:13,
    right:16,
  },
  selectedIcon:{
    width:24,
    height:24
  }
});

export default connect(
  // mapStateToProps,
  // undefined,
  // mergeProps
)(AddressItem);
