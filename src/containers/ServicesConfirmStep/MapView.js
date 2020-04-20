import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View, Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import * as actions from "../../modules/AppState";
import MapView,{Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { IconPickMap } from '../../styles/svg';
import { colors, fonts, fontSize } from '../../styles';

import {HeaderDefault} from "..";
import {ButtonFrame} from '../../components';
import { scale } from 'react-native-size-matters';

const {width,height} = Dimensions.get("window");

const label = {
  headerTitle: "Chọn vị trí thực hiện"
};

const apiKey = `&key=AIzaSyDtjGQAxqV5sQ8Ul3MmxiS9wuR4sfiScL0`;

class LocationView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      latitude:'',
      longitude:'',
      isShow: true,
      description: '',
      isPick: false,
      initLatitude:'',
      initLongitude:'',
    }
  }

  componentDidMount(): void {
    const {formRegisterService} = this.props.app;
    if (formRegisterService) {
      const { address, longitude, latitude } = formRegisterService;
      this.setState({latitude,longitude,description: address, initLatitude: latitude, initLongitude: longitude})
    }
  }

  animateCameraMap = (latitude,longitude) => {
    this.map.animateCamera(
      {
        center: {
          latitude,
          longitude,
        }
      }
    );
  }

  getPlaceOnSubmit = () => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.state.valueSearch}`;
      axios.get(url+ apiKey)
        .then(res => {
          const result = res.data.results[0];
          // console.log(res.data);
          if(result){
            const {lat,lng} = result.geometry.location;
            this.setState({
              initLatitude: lat,
              initLongitude: lng,
              latitude: lat,
              longitude: lng,
              description: result.formatted_address,
              isShow:false
            });

            this.animateCameraMap(lat,lng);
          }
        }).catch(error => {
        //console.log(error);
        // ToastShow(I18n.t('cantFindAddress'));
      });
    } catch (e) {
      // ToastShow(I18n.t('cantFindAddress'));
    }
  };

  GooglePlacesInput = () => (
    <GooglePlacesAutocomplete
      placeholder={this.state.description}
      numberOfLines={1}
      minLength={1} // minimum length of text to search
      returnKeyType="search"
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
        // console.log(data,details);
        const {lat,lng} = details.geometry.location;
        this.setState({
          initLatitude: lat,
          initLongitude: lng,
          latitude: lat,
          longitude: lng,
          isShow: false,
          description: data.description
        });

        this.animateCameraMap(lat,lng);
      }}
      getDefaultValue={() => ''}
      query={{
        key: 'AIzaSyDFUIacoYiRdfXl1qy2rRUr3c7bz0V4hbM',
        language: 'vn', // language of the results
        types: 'geocode' ,// default: 'geocode'
        components: 'country:vn',
      }}
      styles={{
        textInputContainer: styles.textInputContainer,
        container: styles.container,
        textInput: styles.textInput,
        row: styles.row,
        poweredContainer: { display: "none" },
        listView: { display: this.state.isShow ? "flex" : "none", top: 155, marginHorizontal: 15}
      }}
      nearbyPlacesAPI='GooglePlacesSearch'
      GooglePlacesSearchQuery={{
        rankby: 'distance',
        types: 'geocode'
      }}
      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_1']}
      debounce={100}
      onSubmitEditing={this.getPlaceOnSubmit}
      textInputProps={{
        onChangeText: (valueSearch)=>{
          this.setState({valueSearch,isShow:true}
          )}
      }}
    />
  );

  getPlaceOnLongPress = (latitude,longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}
                    &rankby=distance&type=all&${apiKey}`;
      axios.get(url+ apiKey)
        .then(res => {
          const {data} = res;
          if(data && data.results){
            //console.log(res);
            const result = data.results[data.results.length - 1];
            if(result){
              this.setState({
                description: result.vicinity || result.plus_code.compound_code,
                isShow:false
              })
            }
          }
        }).catch(error => {
        //console.log(error);
      });
    } catch (e) {}
  };

  onBack = () => this.props.navigation.goBack();

  onChangeStatePick = () => this.setState({isPick: !this.state.isPick});

  onPressMap = (region)=>{
    // console.log(data.nativeEvent);
    // const {latitude,longitude} = data.nativeEvent.coordinate;
    const {latitude,longitude} = region;
    this.setState({
      latitude,longitude
    },()=>{
      this.getPlaceOnLongPress(latitude,longitude)
    });
  };

  onPressSubmitLocation = () => {
    const {latitude,longitude,description} = this.state;
    const {formRegisterService} = this.props.app;
    if (latitude !== "" && longitude !== "" && description !== "" && formRegisterService) {
      formRegisterService.address = description;
      formRegisterService.latitude = latitude;
      formRegisterService.longitude = longitude;
      this.props.setFormRegisterService(formRegisterService)
      this.props.changeStatus();
    }
    this.props.navigation.goBack();
  };

  onRegionChangeComplete = async (region) => {
    // console.log(region);
    if (region && this.state.isPick) {
      this.onPressMap(region)
    }
  };

  render() {
    const {latitude,longitude, isPick,initLongitude, initLatitude} = this.state;
    return (
      <View style={{flex: 1}}>
        <HeaderDefault
          title={label.headerTitle}
          onPressBack={this.onBack}
          // iconRight={(<IconSubmitRightBar />)}
          // onPressIconRight={this.onPressIconRight}
          styleContainer={{position: "absolute", width, top: 0, backgroundColor: "transparent"}}
        />
        <View>
          {this.GooglePlacesInput()}
        </View>
        <TouchableOpacity
          onPress={this.onChangeStatePick}
          style={styles.buttonPick}
        >
          <IconPickMap width={16} height={26} />
        </TouchableOpacity>
        <ButtonFrame
          title="XÁC NHẬN VỊ TRÍ"
          onPress={this.onPressSubmitLocation}
          style={styles.buttonConfirm}
        />
        <MapView
          style={{flex: 1, zIndex: -1}}
          initialRegion={{
            latitude: latitude || 20.9981372,
            longitude: longitude || 105.7887499,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          provider={PROVIDER_GOOGLE}
          // onPress={isPick && this.onPressMap}
          showsUserLocation
          // showsMyLocationButton
          ref={r => this.map = r}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          <Marker
            coordinate={{
              latitude: initLatitude || 20.9981372,
              longitude: initLongitude || 105.7887499,
            }}
            tracksViewChanges={false}
          />
        </MapView>
        {
          isPick && (
            <View
              style={styles.picker}
              pointerEvents="none"
            >
              <IconPickMap />
            </View>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyContainer:{flexDirection: "row", alignItems: "center", marginBottom: width*0.107},
  modalContainer: { flex: 1 , alignItems: "center", justifyContent: "center"},
  viewShadowContainer: {width: width*0.84, marginHorizontal: fontSize.f30, padding: fontSize.f25},
  buttonPick: {position: "absolute", top: 107, right: 30, zIndex: 9, padding: 5},
  buttonConfirm:{position: "absolute", bottom: 30, left:scale(20), right: scale(20)},
  textInputContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingRight: 34,
    height: 50,
    alignItems: "center",
    marginTop: 0,
    position: "absolute",
    top: 100,
    left: 15,
    right: 15,
    borderRadius: 15,
  },
  container: {
    position: "absolute",
    width,
    height,
    top: 0,
    zIndex: 3,
  },
  textInput: {
    height: 40,
    backgroundColor: colors.white,
    color: colors.darkBlueGray,
    fontFamily: fonts.primarySemiBold,
    fontSize: fontSize.f18,
    marginTop: 0
  },
  row: {
    backgroundColor: colors.white
  },
  picker: {
    left: '50%',
    marginLeft: -10,
    marginTop: -16,
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    height: 48,
    width: 48,
  }
});

const mapStateToProps = (state) => ({
  app: state.app,
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { dispatch } = dispatchProps;
  const { actions } = require("../../redux/AddressWorkshop");
  const {setFormRegisterService} = require("../../modules/AppState");
  // console.log(dispatchProps.dispatch);

  return {
    ...ownProps,
    ...stateProps,
    setFormRegisterService: (formRegisterService) => dispatch(setFormRegisterService(formRegisterService)),
    changeStatus: () => actions.changeStatus(dispatch)
  };
}

export default connect(
  mapStateToProps,
  undefined,
  mergeProps
)(LocationView);

