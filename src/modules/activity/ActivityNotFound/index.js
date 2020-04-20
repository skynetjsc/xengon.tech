import React, {PureComponent} from 'react';
import {View, StyleSheet, Dimensions, Image, Text} from 'react-native';
import {fontSize, fonts} from '../../../styles';
import {ButtonFrame} from "../../../components";
import {IconPlusWhite, IconActivityEmpty} from '../../../styles/svg'

const {width} = Dimensions.get('screen');

class Index extends PureComponent {
  render() {
    const {category} = this.props;
    return (
      <View style={styles.container}>
        <IconActivityEmpty style={{width: width*0.76267, height: width*0.4613, marginBottom: width*0.11}} />
        <Text style={[styles.text, {fontFamily: fonts.primaryBold, marginBottom: width*0.02}]}>Chưa có hoạt động</Text>
        <Text style={styles.text}>Vui lòng chọn một gói dịch vụ</Text>
        <Text style={styles.text}> và trải nghiệm sự tuyệt vời </Text>
        <Text style={styles.text}>mà Xe Ngon mang lại.</Text>
        <ButtonFrame
          image={<IconPlusWhite style={{marginLeft: -width*0.076}}/>}
          style={{width: width*0.155, height: width*0.155, marginTop: width*0.085}}
          onPress={() => {this.props.navigation.navigate('Services', {category})}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  },
  text: {
    fontSize: fontSize.f20,
    fontFamily: fonts.primaryRegular,
    color: "#344356"
  }
});

export default Index;
