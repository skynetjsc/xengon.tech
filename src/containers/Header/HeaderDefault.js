import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text, Dimensions, StatusBar, Platform
} from 'react-native';

import {IconArrowBack,IconMiniCart} from "../../styles/svg"
import { colors, fonts} from '../../styles';


const {width, height} = Dimensions.get("window");

const HeaderDefault = props => {
  const {countProduct, onPressBack, onPressIconRight, title, isHaveMiniCart, isHideBackButton, iconRight,styleContainer, titleStyle, offShadow} = props;

  return (
    <View>
      <StatusBar
        hidden={false}
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={[
        styles.headerContainer,
          !offShadow? {
            shadowOpacity: Platform.OS === 'ios'? 0.1 : 1,
            shadowColor: '#000',
            shadowOffset: {
              width: 0, height: 2
            },
            shadowRadius: 2,
            elevation: 4
          } : null,
        styleContainer
      ]}
      >
        {
          isHideBackButton? <View style={{width: 30, height: 30, justifyContent: "center"}} />: (
            <TouchableOpacity
              accessibilityTraits="button"
              onPress={onPressBack}
              activeOpacity={0.5}
              style={{width: 30, height: 30, justifyContent: "center"}}
            >
              <IconArrowBack />
            </TouchableOpacity>
        )}
        <Text style={[styles.title, titleStyle]}>{title}</Text>

        <TouchableOpacity
          accessibilityTraits="button"
          onPress={onPressIconRight}
          activeOpacity={0.7}
        >
          {
            iconRight || (
              <View>
                <IconMiniCart style={{opacity: isHaveMiniCart ? 1 : 0}} />
                <View style={{...styles.viewRadius, opacity: countProduct > 0 ? 1 : 0}}>
                  <Text style={{...styles.textMiniCart, paddingHorizontal: countProduct > 9 ? 2.25 : 4.25, paddingVertical: countProduct > 9 ? 2 : 0}}>
                    {countProduct}
                  </Text>
                </View>
              </View>
            )
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: width*0.1173,
    marginBottom: 1,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width*0.053,
    backgroundColor: colors.defaultBackgroundColor,
  },
  viewRadius: {
    position: "absolute",
    right: -8,
    top: -8,
    borderWidth: 1.5,
    borderColor: colors.default,
    borderRadius: 30,
    backgroundColor: colors.white
  },
  textMiniCart: {
    fontSize: 11,
    color: colors.default,
    fontFamily: fonts.primaryBold
  },
  title: {
    fontSize: 20,
    color: colors.darkBlueGray,
    fontFamily: fonts.primarySemiBold,
    paddingHorizontal: 15,
    textAlign: "center"
  }
});

export default HeaderDefault;
