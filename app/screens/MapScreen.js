import React from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import * as Location from "expo-location";
import { Marker, Callout, CustomCalloutView } from "react-native-maps";
import db from "../firebase/DatabaseManager";
import { TouchableHighlight } from "react-native-gesture-handler";

export default class MapScreen extends React.Component {
  state = {
    mounted: false,
    markersAreLoaded: false,
    markers: [],
    pids: [],
    region: {
      latitude: 45.464664,
      longitude: 9.18854,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  constructor() {
    super();
    db.getPlaces()
      .then((placesIds) => {
        placesIds.map((placeId) => {
          db.getPlace(placeId).then((place) => {
            console.log(place);
            this.state.markers.push(place);
            this.state.pids.push(placeId);
            console.log("MARKERS");
            console.log(this.state.markers);
          });
        });
      })
      .then(() => {
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        }).then((location) => {
          let regionCurrentPosition = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
          this.setState({ region: regionCurrentPosition });
        });
      });
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

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
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
            >
              <Image
                source={require("../../assets/images/paw.png")}
                style={{ height: 35, width: 35 }}
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
  },
  infoWindow: {
    minWidth: 120,
  },
  placeName: {
    fontWeight: "bold",
  },
});
