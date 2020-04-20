import * as React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import {scale} from 'react-native-size-matters';

import Assets from '../../../assets';
import styles from './styles';
import { Collapse, CollapseBody, CollapseHeader } from 'accordion-collapse-react-native';
import { colors, commonStyle, fonts } from '../../styles';
import { IconNextSmall } from '../../styles/svg';
import { PlaceHolder } from '../index';

const InputInfo = ({title, content, style, data, type, handleSelect, ...props}) => {
  // const { title, name, data,type,handleSelect,collapsed, onChangeCollapse} = props;
  return (
    <Collapse
      style={[styles.wrapper, style]}
      // isCollapsed={collapsed}
      // onToggle={() => onChangeCollapse(type)}
    >
      <CollapseHeader>
        <View style={styles.flex}>
          <View>
            <Text style={styles.dropdownTitle}>{title}</Text>
            <Text style={[commonStyle.h3,{fontFamily: fonts.primarySemiBold}]}>{content}</Text>
          </View>
          <IconNextSmall color={colors.lightGray} />
        </View>
      </CollapseHeader>
      <CollapseBody>
        {
          data ? (
            <FlatList
              data={data}
              keyExtractor={item => item.name}
              contentContainerStyle={{paddingHorizontal: 15}}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
                <RenderItem item={item} handleSelect={() => handleSelect(type,item.id)} />
              )}
            />
          ) : <PlaceHolder />
        }
      </CollapseBody>
    </Collapse>
  );
};

const RenderItem = (props) => {
  const {item,handleSelect} = props;
  return (
    <TouchableOpacity style={styles.btnItem} onPress={handleSelect}>
      <Text>{item.name}</Text>
      <IconNextSmall />
    </TouchableOpacity>
  )
};

export default InputInfo;
