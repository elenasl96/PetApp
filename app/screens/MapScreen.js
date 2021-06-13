import React from "react";
import MapView from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Button,
  TouchableHighlight,
} from "react-native";
import * as Location from "expo-location";
import { Marker, Callout, CustomCalloutView } from "react-native-maps";
import dbPlace from "../firebase/Database/Functions/dbPlace";
import * as Permissions from "expo-permissions";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import mainStyle from "../styles/mainStyle";
import utils from "../shared/utilities";
import { AuthContext } from "../Components/AuthContext";
import * as Device from "expo-device";
import PlacePage from "./PlacePage";

export default class MapScreen extends React.Component {
  state = {
    mounted: false,
    map: null,
    places: [],
    markers: [],
    visibleMarkers: [],
    region: {
      latitude: 45.464664,
      longitude: 9.18854,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    currentPosition: null,
    placeFocused: null,
    pin: [],
    search: null,
  };

  static contextType = AuthContext;

  /*
  constructor() {
    super();
  } */

  componentDidMount() {
    this.setState({ mounted: true });
    if (this.props.navigation.state.params == null && Device.isDevice) {
      this.setMapOnCurrentPosition().then(() => {
        this.getAllPlaces();
      });
    }
  }

  getAllPlaces() {
    if (this.state.places.length == 0) {
      dbPlace.getPlaces().then((placesIds) => {
        this.context.saveGlobalPlaces(placesIds);
        let promises = this.context.globalPlaces.map((placeId) => {
          return dbPlace.getPlace(placeId).then((place) => {
            place.id = placeId;
            return place;
          });
        });
        Promise.all(promises).then((places) => {
          this.setState({ places: places, visibleMarkers: places });
          this.forceUpdate();
          //this.showAllMarkers();
        });
      });
    }
  }

  componentDidUpdate() {
    if (
      this.state.places.length > 0 &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.currentPlace
    ) {
      const currentPlace = this.props.navigation.state.params.currentPlace;
      this.props.navigation.state.params = null;
      this.focusMapOn(currentPlace);
    }

    if (this.state.places.length !== this.context.globalPlaces.length) {
      this.getAllPlaces();
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  async setMapOnCurrentPosition() {
    let { status } = await Location.requestPermissionsAsync();

    if (status === "granted") {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      })
        .then((location) => {
          this.setState({ currentPosition: location });
          let regionUpdate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          this.state.map.animateToRegion(regionUpdate, 1000);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      throw new Error("Location permission not granted");
    }
  }

  getPlaceColor(placeType) {
    if (placeType === "Kennel") {
      return "yellow";
    } else if (placeType === "Veterinary") {
      return "lightblue";
    } else if (placeType === "Park") {
      return "green";
    } else {
      return "orange";
    }
  }

  showPlacesFilteredOn = (type) => {
    this.hideCallouts();
    let filteredMarkers = this.state.places.filter(
      (marker) => marker.type === type
    );
    this.setState({ visibleMarkers: filteredMarkers });
  };

  showAllMarkers() {
    this.hideCallouts();
    let filteredMarkers = this.state.places.filter(
      (marker) => marker == marker
    );
    //this.removeMarkers();
    this.setState({ visibleMarkers: filteredMarkers });
  }

  hideCallouts() {
    this.state.markers.forEach((marker) => {
      if (marker && marker.hideCallout()) {
        marker.hideCallout();
      }
    });
  }

  removeMarkers() {
    this.state.markers = [];
  }

  onRegionChange(region) {
    this.setState({ region, placeFocused: false });
  }

  showPlace(place) {
    this.props.navigation.navigate("Place", {
      place: place,
    });
  }

  focusMapOn(place) {
    let region = {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    };

    if (this.state.map) {
      this.state.map.animateToRegion(region, 1000);
      this.setState({ placeFocused: true });
    }
  }

  searchPlace() {
    let matchingPlaces = [];
    let matchingCoordinates = [];
    this.state.places.forEach((place) => {
      if (utils.searchInPlaces(place.getName(), this.state.search)) {
        matchingPlaces.push(place);
        matchingCoordinates.push({
          latitude: place.getLat(),
          longitude: place.getLng(),
        });
      }
    });
    if (this.state.mounted) {
      this.setState({ visibleMarkers: matchingPlaces });
      this.state.map.fitToCoordinates(matchingCoordinates);
    }
  }

  clearSearch() {
    this.searchInput.blur();
    this.searchInput.clear();
  }

  render() {
    var pins = {
      Veterinary: require("../../assets/images/pin/Veterinary.png"),
      Park: require("../../assets/images/pin/Park.png"),
      Kennel: require("../../assets/images/pin/Kennel.png"),
      Other: require("../../assets/images/pin/Other.png"),
    };
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.searchBox}>
            <View style={styles.mapSearch}>
              <TextInput
                ref={(input) => {
                  this.searchInput = input;
                }}
                placeholder="Search"
                placeholderTextColor="#616161"
                returnKeyType="next"
                value={this.state.search}
                onChangeText={(search) => this.setState({ search })}
              />
            </View>
            <TouchableHighlight
              style={styles.mapButton}
              onPress={this.searchPlace.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>
                <Feather name="search" size={18} color="black" />
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.mapButton}
              onPress={this.clearSearch.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>
                <Feather name="delete" size={18} color="black" />
              </Text>
            </TouchableHighlight>
          </View>

          <View style={styles.mapTopButtons}>
            <TouchableHighlight
              style={[styles.mapButton, { backgroundColor: "#48bfe3" }]}
              onPress={() => this.showPlacesFilteredOn("Veterinary")}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center", color: "white" }}>Vet</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.mapButton, { backgroundColor: "#e76f51" }]}
              onPress={() => this.showPlacesFilteredOn("Kennel")}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Kennel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.mapButton, { backgroundColor: "#52b788" }]}
              onPress={() => this.showPlacesFilteredOn("Park")}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center", color: "white" }}>Park</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.mapButton}
              onPress={this.showAllMarkers.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>All</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.bottomOverlay}>
          <TouchableHighlight
            style={styles.mapButton}
            onPress={this.setMapOnCurrentPosition.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={{ textAlign: "center" }}>
              <Feather name="map-pin" size={24} color="black" />
            </Text>
          </TouchableHighlight>
        </View>
        <MapView
          ref={(map) => {
            this.state.map = map;
          }}
          initialRegion={this.state.region}
          region={this.state.region}
          style={styles.mapStyle}
          onMapReady={this.getAllPlaces.bind(this)}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#eeeeee"
          moveOnMarkerPress={false}
          showsUserLocation={true}
          showsCompass={true}
          showsPointsOfInterest={false}
        >
          {this.state.visibleMarkers.map((marker, index) => (
            <Marker
              key={index}
              ref={(ref) => {
                this.state.markers[index] = ref;
              }}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.name}
              description={marker.address}
              onCalloutPress={() => this.showPlace(marker, index)}
              //tracksViewChanges={false}
              style={styles.marker}
            >
              <Image
                source={pins[marker.type]}
                style={[
                  styles.markerImage,
                  //{ tintColor: this.getPlaceColor(marker.type) },
                ]}
              />
              <Callout>
                <TouchableHighlight>
                  <View style={styles.infoWindow}>
                    <Text style={styles.placeName}>{marker.name}</Text>
                    <Text>{marker.address}</Text>
                  </View>
                </TouchableHighlight>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    zIndex: -1,
  },
  infoWindow: {
    minWidth: 150,
  },
  placeName: {
    fontWeight: "bold",
  },
  mapTopButtons: {
    flex: 1,
    flexDirection: "row",
    marginTop: 8,
  },
  mapButton: {
    padding: 12,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
    elevation: 2,
    marginHorizontal: 5,
  },
  mapSearch: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 25,
    justifyContent: "center",
    paddingHorizontal: 20,
    elevation: 2,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 5,
  },
  markerImage: {
    height: 40,
    width: 35,
  },
  overlay: {
    position: "absolute",
    top: 10,
    right: 10,
    left: 10,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    right: 10,
    flex: 1,
    flexDirection: "row",
  },
});
