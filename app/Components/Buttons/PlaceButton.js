import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ImageBackground,
} from "react-native";
import dbPlace from "../../firebase/database/functions/DbPlace";
import { AuthContext } from "../custom/ContextProvider";

class PlaceButton extends React.Component {
  static contextType = AuthContext;

  state = {
    places: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  getMyPlaces(places) {
    let promises = places.map((placeID) => {
      return dbPlace.getPlace(placeID).then((place) => {
        place.id = placeID;
        return place;
      });
    });

    Promise.all(promises).then((places) => {
      if (this.state.mounted) {
        this.setState({ places: places });
      }
    });
  }

  showPlace(place) {
    if (!this.props.isSavedPlace) {
      this.props.navigation.navigate("Place", {
        place: place,
        deletePlace: this.props.deletePlace,
      });
    } else {
      this.props.navigation.navigate("Place", {
        place: place,
        // no need for delete in this case
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.props.places != null) {
      //  if (!this.props.isSavedPlace) {
      return this.props.places.map((place, index) => (
        <TouchableHighlight
          key={place.id}
          onPress={() => this.showPlace(place)}
          style={styles.place}
        >
          <ImageBackground
            source={{ uri: place.photo }}
            style={styles.placeImage}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.title}>{place.name}</Text>
            </View>
          </ImageBackground>
        </TouchableHighlight>
      ));
      /*} else {
      return this.props.places.map((place, index) => (
        <View key={index}>
          <TouchableHighlight
            onPress={() => this.showPlace(place)}
            style={styles.pet}
          >
            <ImageBackground
              source={{ uri: place.photo }}
              imageStyle={{ borderRadius: 20 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.title}>{place.name}</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      ));
       }*/
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
    //maxWidth: 300,
    elevation: 2,
    marginVertical: 7,
    borderRadius: 20,
    backgroundColor: "white",
    //flexGrow: 0,
    //flexShrink: 1,
    //flexBasis: 200,
    //flex: 2,

    marginHorizontal: 10,
    width: 250,
    height: 150,
  },
  title: {
    marginVertical: 55,
    color: "black",
    //textShadowColor: "orange",
    textShadowRadius: 3,
    fontSize: 20,
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    position: "absolute",
    right: 10,
    bottom: -40,
  },
  placeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 20,
  },
  overlay: {
    backgroundColor: "rgba(150, 150, 150, 0)",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  pet: {
    marginHorizontal: 10,
    width: 150,
    height: 150,
    backgroundColor: "orange",
    elevation: 5,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    resizeMode: "cover",
  },
});
export default PlaceButton;
