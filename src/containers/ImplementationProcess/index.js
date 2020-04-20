import React from 'react';
import {
  StyleSheet,
  View,
  Text, Dimensions,
} from 'react-native';

import {colors, fonts} from '../../styles';
import {IconProcess} from "../../styles/svg"

import {ViewShadow,MultiplePlaceHolders} from "../../components"
import ProcessItem from "./ProcessItem"

const {width} = Dimensions.get("window");

const headerTitle = "QUY TRÌNH THỰC HIỆN";

const ListImplementation = props => {
  const {listProcess, loadingImplementation,style} = props;

  return (
    <View>
      {
        loadingImplementation ? (
          <MultiplePlaceHolders />
        ) : listProcess ?
          (
            <ViewShadow style={[styles.container,style]}>
              <View style={{flexDirection: "row", marginLeft: -5}}>
                <View>
                  <IconProcess style={{zIndex: 1, backgroundColor: colors.white}} />
                  <View style={styles.lineContainer} />
                </View>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
              </View>
              {
                listProcess.map((item,index) => {
                  if (item) {
                    return (
                      <ProcessItem
                        title={item.title}
                        subTitle={item.content}
                        lastItem={index === listProcess.length - 1 && true}
                        key={item.id}
                      />
                    )
                  }
                })
              }
            </ViewShadow>
          ) : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: width*0.053,
    padding: width*0.059,
    marginBottom: 30,
  },
  headerTitle: {
    fontFamily: fonts.primaryBold,
    fontSize: 18,
    color: colors.default,
    marginBottom: 25,
    marginTop: 5,
    marginLeft: width*0.04375
  },
  lineContainer: {
    position: "absolute",
    width:1,
    top: 0,
    bottom: 0,
    left: 17,
    backgroundColor: colors.default
  }
});

export default ListImplementation;
