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

  /*
  constructor() {
    super();
  } */

  componentDidMount() {
    this.setState({ mounted: true });
    if (this.props.navigation.state.params == null) {
      this.setMapOnCurrentPosition();
    }
    dbPlace.getPlaces().then((placesIds) => {
      let promises = placesIds.map((placeId) => {
        return dbPlace.getPlace(placeId).then((place) => {
          place.id = placeId;
          return place;
        });
      });
      Promise.all(promises).then((places) => {
        this.setState({ places: places });
        this.showAllMarkers();
      });
    });
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
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  async setMapOnCurrentPosition() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
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

  showVetMarkers() {
    this.hideCallouts();
    let vetMarkers = this.state.places.filter(
      (marker) => marker.type === "Veterinary"
    );
    this.setState({ visibleMarkers: vetMarkers });
  }

  showKennelMarkers() {
    this.hideCallouts();
    let kennelMarkers = this.state.places.filter(
      (marker) => marker.type === "Kennel"
    );
    this.setState({ visibleMarkers: kennelMarkers });
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
    let allMarkers = this.state.places;
    //this.removeMarkers();
    this.setState({ visibleMarkers: allMarkers });
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
    console.log(place);
    this.props.navigation.navigate("Place", {
      place: place,
    });
  }

  focusMapOn(place) {
    let region = {
      latitude: place.region.latitude,
      longitude: place.region.longitude,
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
      if (
        utils.similarity(place.getName(), this.state.search) > 0.9 ||
        place.getName().includes(this.state.search)
      ) {
        matchingPlaces.push(place);
        matchingCoordinates.push(place.getLatLng());
      }
    });
    if (this.state.mounted) {
      this.setState({ visibleMarkers: matchingPlaces });
      this.state.map.fitToCoordinates(matchingCoordinates);
    }
  }

  render() {
    this.state.markers = [];
    //console.log(this.state.markers.length);
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.searchBox}>
            <View style={styles.mapSearch}>
              <TextInput
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
          </View>

          <View style={styles.mapTopButtons}>
            <TouchableHighlight
              style={styles.mapButton}
              onPress={() => this.showPlacesFilteredOn("Veterinary")}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>Vet</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.mapButton}
              onPress={() => this.showPlacesFilteredOn("Kennel")}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>Kennel</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.mapButton}
              onPress={() => this.showPlacesFilteredOn("Park")}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>Park</Text>
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
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {(this.state.markers = [])}
          {this.state.visibleMarkers.map((marker, index) => (
            <Marker
              key={index}
              ref={(ref) => {
                this.state.markers[index] = ref;
              }}
              coordinate={{
                latitude: marker.region.latitude,
                longitude: marker.region.longitude,
              }}
              title={marker.name}
              description={marker.address}
              onCalloutPress={() => this.showPlace(marker, index)}
              tracksViewChanges={false}
              style={styles.marker}
            >
              <Image
                source={require("../../assets/images/paw.png")}
                style={[
                  styles.markerImage,
                  { tintColor: this.getPlaceColor(marker.type) },
                ]}
              />
              <Callout>
                <TouchableHighlight>
                  <View style={styles.infoWindow}>
                    <Text style={styles.placeName}>{marker.name}</Text>
                    <Text>
                      {marker.description}
                      {"\n"}
                      {marker.address}
                    </Text>
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
    minWidth: 120,
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
    padding: 8,
    borderRadius: 30,
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
  },
  markerImage: {
    height: 35,
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
