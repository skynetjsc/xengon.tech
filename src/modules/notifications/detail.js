import React, { Component } from 'react';
import { Dimensions, View, StyleSheet, ScrollView } from 'react-native';

import { connect } from 'react-redux';
import moment from "moment";
import APIManager from '../../helpers/APIManager';

import {IconNotiDefault,IconNotiCoupon} from '../../styles/svg';
import { colors, fonts, fontSize, commonStyle} from '../../styles';

import { MultiplePlaceHolders, ViewShadow,Text} from '../../components';
import { HeaderDefault } from '../../containers';

const {width} = Dimensions.get('screen');

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: null
    };

  }

  componentDidMount(): void {
    const {profile} = this.props.app;
    const {id} = this.props.navigation.state.params;
    if(profile && id){
      this.getNotificationDetail(profile.id,id);
    }
  }

  getNotificationDetail = (userid,notiId) => {
    APIManager.getInstance().notificationDetail(userid,notiId)
      .then(res => {
        if (res.data.data) {
          this.setState({detail: res.data.data})
        } else {
          alert("Đã xảy ra lỗi ,vui lòng thử lại!!")
        }
      })
      .catch(err => {
        console.log(err);
        alert("Đã xảy ra lỗi ,vui lòng thử lại!!")
      });
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  render() {
    const {detail} = this.state;
    const typeNoti = detail && detail.hasOwnProperty("type_noty") ? detail.type_noty : "";
    return (
      <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
        <HeaderDefault title="" onPressBack={this.goBack} />
        {
          detail ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              bounces={false}
            >
              <ViewShadow style={styles.viewShadow}>
                <View style={{alignSelf: "center", marginTop: -32 }}>
                  {
                    typeNoti === "1" ?
                      <IconNotiDefault width={64} height={64} /> :
                      <IconNotiCoupon width={64} height={64} />
                  }
                </View>

                <View style={{alignItems: typeNoti === "1" ? "flex-start" : "center"}}>
                  <Text style={[commonStyle.h3, {marginTop: 30, textAlign: typeNoti === "1" ? "left" : "center"}]}>
                    {detail.title}
                  </Text>
                  <Text style={{textTransform: "capitalize", color: colors.grey, marginVertical: 8}}>
                    {moment(detail.date).format("dddd, Ngày DD/MM/YYYY")}
                  </Text>
                  {
                    typeNoti === "2" && (
                      <View style={styles.codeContainer}>
                        <Text style={[commonStyle.h3, {color: colors.defaultBgButton}]}>{detail.code}</Text>
                      </View>
                    )
                  }
                </View>

                <View style={{paddingHorizontal: typeNoti === "2" ? 10 : 0}}>
                  <Text style={styles.content}>{detail.content}</Text>
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
  viewShadow: {flex: 1, marginHorizontal: 10, paddingHorizontal: 15, marginTop: 60},
  codeContainer: {minHeight: 54, minWidth: 260, marginTop: 20, marginBottom: 30, borderWidth: 1.5, borderColor: colors.defaultBgButton, borderStyle: "dashed", borderRadius: 15, alignItems: "center", justifyContent: "center"},
  content: {color: colors.darkBlueGray, fontSize: fontSize.f16, lineHeight: 26, marginBottom: 20}
});

const mapStateToProps = (state) => ({
  app: state.app,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
  };
}

export default connect(mapStateToProps,null,mergeProps)(Detail);

