/**
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, ScrollView, PixelRatio, Dimensions } from 'react-native';
import YouTube from 'react-native-youtube';

export default class Youtube extends React.Component {
  state = {
    isPlaying: true,
    isLooping: true,
    fullscreen: false,
    playerWidth: Dimensions.get('window').width,
  };

  _youTubeRef = React.createRef();

  render() {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <YouTube
          apiKey="AIzaSyChLMU55z95pQ6b-8iEiycZD9izJjzd55E"
          ref={this._youTubeRef}
          videoId={this.props.videoId}
          play={this.state.isPlaying}
          loop={this.state.isLooping}
          fullscreen={this.state.fullscreen}
          controls={1}
          style={[
            { height: PixelRatio.roundToNearestPixel(this.state.playerWidth / (16 / 9)) },
            styles.player,
          ]}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  player: {
    alignSelf: 'stretch',
    marginVertical: 10,
  },
});
