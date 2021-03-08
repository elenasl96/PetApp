import React from "react";
import MapView from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { Marker, Callout, CustomCalloutView } from "react-native-maps";
import db from "../firebase/DatabaseManager";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Permissions from "expo-permissions";

export default class MapScreen extends React.Component {
  state = {
    mounted: false,
    markersAreLoaded: false,
    markers: [],
    pids: [],
    map: null,
    region: {
      latitude: 45.464664,
      longitude: 9.18854,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    currentPosition: null,
  };

  constructor() {
    super();
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
    switch (placeType) {
      case "vet":
        return "blue";
      case "kennel":
        return "orange";
      default:
        return "green";
    }
  }

  componentDidMount() {
    this.setState({ mounted: true });
    db.getPlaces().then((placesIds) => {
      placesIds.map((placeId) => {
        db.getPlace(placeId).then((place) => {
          this.state.markers.push(place);
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

  render() {
    return (
      <View style={styles.container}>
        <Button
          style={styles.currentPositionButton}
          title="P"
          onPress={this.setMapOnCurrentPosition.bind(this)}
        />
        <MapView
          ref={(map) => {
            this.state.map = map;
          }}
          initialRegion={this.state.region}
          region={this.state.region}
          style={styles.mapStyle}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {this.state.markers.map((marker, index) => (
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
    height: Dimensions.get("window").height - 150,
  },
  infoWindow: {
    minWidth: 120,
  },
  placeName: {
    fontWeight: "bold",
  },
  currentPositionButton: {
    position: "absolute",
    right: 20,
    top: 400,
    zIndex: 1,
  },
  markerImage: {
    height: 35,
    width: 35,
  },
});
