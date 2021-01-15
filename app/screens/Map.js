import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import * as Location from "expo-location";
import { Marker } from "react-native-maps";
import db from "../firebase/DatabaseManager";

export default class MapScreen extends React.Component {
  state = {
    markers: [],
    region: {
      latitude: 45.464664,
      longitude: 9.18854,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  constructor() {
    super();
    db.getPlaces().then((placesIds) => {
      placesIds.map((placeId) => {
        db.getPlace(placeId).then((place) => {
          let LatLng = [];
          LatLng.push(place.region.latitude);
          LatLng.push(place.region.longitude);
          this.state.markers.push(place.region);
          console.log("MARKERS");
          console.log(this.state.markers);
        });
      });
    });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          style={styles.mapStyle}
          onRegionChangeComplete={this.onRegionChange.bind(this)}
        >
          {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: 45.495644999999996, longitude: 9.194631 }}
              title={marker.title}
              description={marker.description}
            />
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
  },
});
