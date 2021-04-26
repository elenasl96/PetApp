import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  ImageBackground,
} from "react-native";
import dbPlace from "../../firebase/Database/Functions/dbPlace";
import { AuthContext } from "../AuthContext";

class PlaceButton extends React.Component {
  static contextType = AuthContext;

  state = {
    places: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    console.log("COMPONENT DID MOUNT PLACEBUTTON");
    console.log(this.props.places);
    this.getMyPlaces(this.props.places);
  }

  getMyPlaces(places) {
    let promises = places.map((placeID) => {
      return dbPlace.getMyPlace(this.context.uid, placeID).then((place) => {
        place.id = placeID;
        return place;
      });
    });
    Promise.all(promises).then((places) => {
      console.log("places in component did mount");
      console.log(places);
      this.setState({ places: places });
    });
  }

  showPlace(place) {
    this.props.navigation.navigate("Place", {
      place: place,
      deletePlace: this.props.deletePlace,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.places == null) {
      console.log("COMPONENTDIDUPDATE  PLACE BUTTON");
      console.log("places placebutton: " + this.props.places);
      const places = this.props.places;

      let promises = places.map((placeID) => {
        return dbPlace.getPlace(placeID).then((place) => {
          place.id = placeID;
          return place;
        });
      });

      Promise.all(promises).then((places) => {
        console.log("PLACES in place button");
        console.log(places);
        if (this.state.mounted) {
          this.setState({ places: places });
        }
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.places != null) {
      return this.state.places.map((place, index) => (
        <View key={index}>
          <TouchableHighlight
            onPress={() => this.showPlace(place)}
            style={styles.place}
          >
            <ImageBackground
              source={{ uri: place.getPhoto() }}
              style={styles.placeImage}
            >
              <View style={styles.overlay}>
                <Text style={styles.title}>{place.name}</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      ));
    } else {
      return (
        <Text style={{ textAlign: "center" }}>
          Places you'll find and like in the map will appear here!
        </Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  place: {
    width: "100%",
    elevation: 2,
    marginVertical: 7,
  },
  title: {
    marginVertical: 55,
    color: "white",
    textShadowColor: "black",
    textShadowRadius: 3,
    alignSelf: "center",
    fontSize: 20,
  },
  placeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(150, 150, 150, 0.3)",
    width: "100%",
    height: "100%",
  },
});
export default PlaceButton;
