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
import db from "../firebase/DatabaseManager";
import * as Permissions from "expo-permissions";
import { Feather } from "@expo/vector-icons";

export default class MapScreen extends React.Component {
  state = {
    mounted: false,
    markersAreLoaded: false,
    places: [],
    visibleMarkers: [],
    pids: [],
    map: null,
    region: {
      latitude: 45.464664,
      longitude: 9.18854,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    currentPosition: null,
    pin: [],
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.setState({ mounted: true });
    db.getPlaces().then((placesIds) => {
      placesIds.map((placeId) => {
        db.getPlace(placeId).then((place) => {
          this.state.places.push(place);
          this.state.visibleMarkers.push(place);
          this.state.pids.push(placeId);
          this.setState({ mounted: true });
        });
      });
    });
  }

  componentDidUpdate() {
    if (this.state.markersAreLoaded) {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      })
        .then((location) => {
          let regionCurrentPosition = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          console.log("POSITION CHANGING");
          this.setState({ region: regionCurrentPosition });
        })
        .then(this.setState({ markersAreLoaded: false }));
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  async setMapOnCurrentPosition() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
      });
      this.setState({ currentPosition: location });
      let regionUpdate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      this.state.map.animateToRegion(regionUpdate, 1);
    } else {
      throw new Error("Location permission not granted");
    }
  }

  getPlaceColor(placeType) {
    if (placeType == "kennel" || placeType == "Kennel") {
      return "orange";
    } else if (placeType === "Vet" || placeType === "vet") {
      return "lightblue";
    } else {
      return "green";
    }
  }

  showVetMarkers() {
    let vetMarkers = this.state.places.filter(
      (marker) => marker.type === "Vet" || marker.type === "vet"
    );
    this.setState({ visibleMarkers: vetMarkers });
  }

  showKennelMarkers() {
    let kennelMarkers = this.state.places.filter(
      (marker) => marker.type === "kennel" || marker.type === "Kennel"
    );
    console.log(kennelMarkers);
    this.setState({ visibleMarkers: kennelMarkers });
  }

  showAllMarkers() {
    this.setState({ visibleMarkers: this.state.places });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  showPlace(place, index) {
    if (place.getType() == "kennel") {
      this.props.navigation.navigate("Kennel", {
        place: place,
        pid: this.state.pids[index],
      });
    } else {
      this.props.navigation.navigate("Vet", {
        place: place,
        pid: this.state.pids[index],
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <TouchableHighlight
            style={styles.mapButton}
            onPress={this.showVetMarkers.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={{ textAlign: "center" }}>Vet</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.mapButton}
            onPress={this.showKennelMarkers.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={{ textAlign: "center" }}>Kennel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.mapButton}
            onPress={this.showAllMarkers.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={{ textAlign: "center" }}>All</Text>
          </TouchableHighlight>
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
          {this.state.visibleMarkers.map((marker, index) => (
            <Marker
              key={index}
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
  mapButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
    elevation: 2,
    marginHorizontal: 5,
  },
  markerImage: {
    height: 35,
    width: 35,
  },
  overlay: {
    position: "absolute",
    flex: 1,
    top: 10,
    right: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    right: 10,
    flex: 1,
    flexDirection: "row",
  },
});
