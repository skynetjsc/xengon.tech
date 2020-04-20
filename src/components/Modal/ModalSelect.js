import * as React from 'react';
import { View, TouchableOpacity, Image, TextInput, StatusBar, FlatList, Dimensions } from 'react-native';
import {scale} from 'react-native-size-matters';

import { colors, commonStyle, fonts, fontSize } from '../../styles';
import { ButtonFrame, ViewShadow ,Text} from '../index';
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/Ionicons';

// import {ButtonFrame,Text,ViewShadow} from '../../../components';

const { width } = Dimensions.get('window');

class ModalSelect extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  renderItemModal = ({item, index}) => {
    const {indexSelect,handleSelect} =  this.props;
    const name = item.name ? item.name : "";
    const address = item.address? item.address : "";
    return (
      <TouchableOpacity
        style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 7}}
        onPress={() => handleSelect(item.id)}
      >
        <Text style={{fontSize: fontSize.f14}}>{name !== ""? name : address}</Text>
        {
          indexSelect === index && indexSelect !== null ? (
            <Icon
              name="md-radio-button-on"
              color={colors.default}
              size={26}
            />
          ) : (
            <Icon
              name="md-radio-button-off"
              color={colors.default}
              size={26}
            />
          )
        }
      </TouchableOpacity>
    )
  };

  getItemLayout = (data, index) => (
    {length: 41, index, offset: 41 * index}
  );

  render() {
    const {statusOfModal,titleModal,indexSelect,dataModal,toggleModal} = this.props;

    return (
      <Modal
        isVisible={statusOfModal !== "off"}
        style={{justifyContent: 'center', alignItems: 'center'}}
      >
        <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,0.7)" translucent />
        <ViewShadow style={{maxHeight: 420, width: width - scale(50)}}>
          <Text style={[commonStyle.h1, {paddingHorizontal: scale(25), marginTop: 15}]}>
            {titleModal}
          </Text>
          <FlatList
            initialScrollIndex={indexSelect}
            style={{marginBottom: 30, marginTop: 15}}
            contentContainerStyle={{paddingHorizontal: scale(25)}}
            data={dataModal}
            ref={ref => this.flatListRef = ref}
            getItemLayout={this.getItemLayout}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItemModal}
            keyExtractor={(item) => item.id}
            onScrollToIndexFailed={info => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                this.flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />
          <ButtonFrame
            title='XONG'
            onPress={() => toggleModal("off")}
            style={{marginHorizontal: scale(25), marginBottom: 20}}
          />
        </ViewShadow>
      </Modal>
    )
  }
}

export default ModalSelect;
