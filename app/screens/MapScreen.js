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
    region: {
      latitude: 45.464664,
      longitude: 9.18854,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  };

  constructor() {
    super();
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest,
    }).then((location) => {
      console.log("CurrentPosition: ");
      console.log(location);
      let regionCurrentPosition = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      this.setState({ region: regionCurrentPosition });
    });
    db.getPlaces().then((placesIds) => {
      placesIds.map((placeId) => {
        db.getPlace(placeId).then((place) => {
          console.log(place);
          this.state.markers.push(place);
          console.log("MARKERS");
          console.log(this.state.markers);
        });
      });
    });
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  showPlace(place) {
    if (place.getType() == "kennel") {
      this.props.navigation.navigate("Kennel", {
        place: place,
      });
    } else {
      this.props.navigation.navigate("Vet", {
        place: place,
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
              onCalloutPress={() => this.showPlace(marker)}
              tracksViewChanges={false}
            >
              <Image
                source={require("../../assets/images/paw.png")}
                style={{ height: 35, width: 35 }}
              />
              <Callout>
                <TouchableHighlight>
                  <View>
                    <Text>
                      {marker.name}
                      {"\n"}
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
});
