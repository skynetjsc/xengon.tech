import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';

import moment from "moment";

import { HeaderDefault } from '../../containers';
import { colors, fonts, fontSize, commonStyle} from '../../styles';
import { MultiplePlaceHolders, ViewShadow , Text} from '../../components';
import {IconLogo} from '../../styles/svg'
import APIManager from '../../helpers/APIManager';

class index extends Component {
  constructor() {
    super();
    this.state = {
      Terms: null
    }
  }

  componentDidMount(): void {
    this.getPrivacy();
  }

  getPrivacy = () => {
    APIManager.getInstance().getPrivacy()
      .then(res => {
        const {data} = res.data;
        if (data) {
          this.setState({Terms: data})
        }
      })
      .catch((err) => {
        //console.log(err);
        alert("Đã xảy ra lỗi ,vui lòng thử lại!!")
      });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {Terms} = this.state;
    const date = Terms && Terms.date ? Terms.date : "";
    const content = Terms && Terms.content ? Terms.content : "";

    return (
      <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
        <HeaderDefault title="" onPressBack={this.goBack} />
        {
          Terms ? (
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              showsVerticalScrollIndicator={false}
            >
              <ViewShadow style={styles.viewShadow}>
                <Text style={[commonStyle.h3, {textAlign: "center", fontFamily: fonts.primarySemiBold}]}>
                  Chính sách và điều khoản
                </Text>
                <Text style={{color: colors.grey, marginVertical: 8}}>
                  Cập nhật
                  <Text style={{textTransform: "capitalize"}}>
                    {moment(date).format(" dddd, Ngày DD/MM/YYYY")}
                  </Text>
                </Text>

                <IconLogo style={{marginVertical: 30}} />

                <View>
                  <Text style={styles.content}>{content}</Text>
                </View>
              </ViewShadow>
            </ScrollView>
          ) : (
            <View>
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
              <MultiplePlaceHolders />
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewShadow: {flex: 1, marginHorizontal: 10, paddingHorizontal: 25, marginTop: 32, alignItems: "center", paddingTop: 40},
  codeContainer: {minHeight: 54, minWidth: 260, marginTop: 20, marginBottom: 30, borderWidth: 1.5, borderColor: colors.defaultBgButton, borderStyle: "dashed", borderRadius: 15, alignItems: "center", justifyContent: "center"},
  content: {color: colors.darkBlueGray, fontSize: fontSize.f16, lineHeight: 26,fontFamily: fonts.primaryRegular, marginBottom: 20}
});

export default (index);

