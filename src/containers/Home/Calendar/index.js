import React, { Component } from 'react';
import {View, Dimensions} from 'react-native';
import {ItemCalendarHome, TitleCategoriesHome} from '../../../components';
import {IconCalendar, IconCarBlue, IconTemp} from '../../../styles/svg';

const {width} = Dimensions.get('screen');

const title = 'LỊCH HẸN SẮP TỚI';

class Index extends Component {
  render() {
    // console.log(this.props.data)
    return (
      <View style={{marginTop: -width*0.04}}>
        <View style={{marginBottom: width*0.06}}>
          <TitleCategoriesHome icon={<IconCalendar />} title={title} />
        </View>
        <ItemCalendarHome
          data={this.props.data}
          serviceName={this.props.serviceName}
          onPress={this.props.onPress}
        />
      </View>
    );
  }
}

export default Index;
