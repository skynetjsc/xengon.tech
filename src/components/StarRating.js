import React, {PureComponent} from 'react';
import {AirbnbRating} from "react-native-ratings";
import {Dimensions, View} from "react-native";

const {width} = Dimensions.get('screen');

class StarRating extends PureComponent {
    render() {
        const {style, rating, size, styleStar} = this.props;
        return (
          <View style={style}>
            <AirbnbRating
              count={5}
              defaultRating={rating}
              size={size || 15}
              showRating={false}
              starContainerStyle={styleStar}
            />
            <View
              style={{
                position: "absolute",
                height: 40,
                width: width*0.3,
                backgroundColor: "transparent",
                right: 0, top: -10,
                // opacity: 0.2
              }}
            />
          </View>
        );
    }
}

export default StarRating;
