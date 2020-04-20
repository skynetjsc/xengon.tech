import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text, Dimensions,
} from 'react-native';

import { colors, fonts, fontSize} from '../../styles';
import {PlaceHolder} from "../../components"

const {width} = Dimensions.get("window");

const TabSelector = props => {
  const {listSelect, loadingSelector, onPress, indexSelectorSelected, style,styleItem,indexStyle} = props;

  return (
    <View style={styles.selectContainer}>
      {
        loadingSelector ? (
          <PlaceHolder />
        ) : (
          <View style={[styles.selectBox, style]}>
            {
              listSelect.map((item,index) => (
                <ButtonSelector
                  title={item.title}
                  index={index}
                  onPress={() => onPress(index)}
                  isActive={index === indexSelectorSelected && true}
                  lastItem={index === listSelect.length - 1 && true}
                  key={item.title}
                  styleItem={{flex: styleItem ? (index === indexStyle ? 1.5 : 1) : 1}}
                />
              ))
            }
          </View>
        )
      }
    </View>
  );
};

const ButtonSelector = props => {
  const {title,onPress,isActive,index,lastItem, styleItem} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{marginRight: index === 0 ? 1 : 0,marginHorizontal: index > 0 && index < lastItem ? 1 : 0, marginLeft: lastItem ? 1 : 0,
        ...styles.buttonSelect, ...styleItem
      }}
      activeOpacity={0.7}
    >
      <Text style={{...styles.title, fontFamily: isActive ? fonts.primaryBold : fonts.primaryRegular,
        color: isActive ? colors.default : colors.darkBlueGray}}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  selectContainer: {
    paddingVertical: 12,
    paddingHorizontal: width*0.053,
    // shadowColor: "#3C80D1",
    // shadowOffset: {
    //   width: 0,
    //   height: 12,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 20,
    // elevation: 10,
  },
  selectBox: {
    height: 44, borderRadius: 13, backgroundColor: colors.defaultBackgroundColor, flexDirection: "row", overflow: "hidden"
  },
  buttonSelect: {
    alignItems: "center",justifyContent: "center",backgroundColor: colors.white, flex: 1
  },
  title: {
    textTransform: "uppercase", fontSize: fontSize.f14, letterSpacing: 1, textAlign: "center"
  }
});

export default TabSelector;
