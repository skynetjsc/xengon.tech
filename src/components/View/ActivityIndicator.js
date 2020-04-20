import React, {PureComponent} from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import { scale } from 'react-native-size-matters';


class ActivityIndicator extends PureComponent {

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const {onLayout, style, visible, carStyle, ...restProps} = this.props;
    return (
      <View
        style={StyleSheet.compose(
          styles.container,
          style,
        )}
        {...restProps}
      >
        <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("../../../assets/3532-car.json")}
          animationStyle={StyleSheet.compose(
            styles.lottie,
            carStyle)}
          speed={1}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: scale(200),
    height: scale(200)
  },
});

export  default ActivityIndicator;
