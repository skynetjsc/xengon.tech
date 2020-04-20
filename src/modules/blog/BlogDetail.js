import React, { Component } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../../styles';
import { HeaderDefault } from '../../containers';

const {height, width} = Dimensions.get('screen');

class BlogDetail extends Component {

  constructor() {
    super();
    this.state = {
      link: "",
      title: "",
    }
  }

  componentDidMount(): void {
    const blogDetail = this.props.navigation.getParam("blogDetail");
    const link = blogDetail.content && blogDetail.content.hasOwnProperty("rendered") && blogDetail.content.rendered ? blogDetail.content.rendered : "";
    const title = blogDetail.title && blogDetail.title.hasOwnProperty("rendered") && blogDetail.title.rendered ? blogDetail.title.rendered : "";
    this.setState({link,title});
  }

  goBack = () => this.props.navigation.goBack();

  render() {
    return (
      <View style={{flex: 1, backgroundColor: colors.defaultBackgroundColor}}>
        <HeaderDefault onPressBack={this.goBack} />
        <View style={{flex: 1}}>
          <WebView
            originWhitelist={['*']}
            style={{ paddingHorizontal: 30 }}
            source={{ html:
                '<html>' +
                '<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
                '<link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700&display=swap" rel="stylesheet">' +
                '<style> ' +
                'img { display: block; max-width: 100%; height: auto; } ' +
                'body {padding: 15px 10px} ' +
                'h1 {line-height: 26px; font-size: 22px; font-family: "Nunito"; text-align: center;}' +
                'p {line-height: 26px; font-size: 18px; font-family: "Nunito";}' +
                '</style>' +
                '<h1>'+this.state.title+ '</h1>' +
                '<body>'+this.state.link+'</body>' +
                '</html>'
            }}
          />
        </View>
      </View>
      );
  }
}

export default BlogDetail;
