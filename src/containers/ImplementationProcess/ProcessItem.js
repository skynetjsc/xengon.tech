import React from 'react';
import {
  StyleSheet,
  View, Dimensions,
} from 'react-native';

import { colors, fonts} from '../../styles';
import {IconDot} from "../../styles/svg"
import {Text} from "../../components"

const {width} = Dimensions.get("window");

const ProcessItem = props => {
  const {title,subTitle,lastItem} = props;

  return (
    <View style={{flexDirection: "row"}}>
      <View>
        <IconDot style={{zIndex: 1}} />
        <View style={{...styles.lineContainer, opacity: lastItem ? 0 : 1}} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  lineContainer: {
    position: "absolute",
    width: 1,
    top: 0,
    bottom: 0,
    left: 11.5,
    backgroundColor: colors.default
  },
  textContainer: {
    marginBottom: 22,
    marginLeft: width*0.059,
    marginRight: width*0.059 + 12
  },
  title: {
    fontFamily: fonts.primaryBold, fontSize: 18, color: colors.darkBlueGray
  },
  subTitle: {
     fontSize: 13, color: colors.lightGray, marginTop: 2, lineHeight: 17
  }
});

export default ProcessItem;
