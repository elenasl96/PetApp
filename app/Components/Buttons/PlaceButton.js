import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import db from "../../firebase/DatabaseManager";
import { AuthContext } from "../AuthContext";

class PlaceButton extends React.Component {
  static contextType = AuthContext;

  state = {
    places: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  showPlace(placesID, place) {
    if (place.isKennel() && this.state.mounted) {
      this.props.navigation.navigate("Kennel", {
        pid: placesID,
        place: place,
      });
    } else {
      this.props.navigation.navigate("Vet", {
        pid: placesID,
        place: place,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.places == null && this.state.mounted) {
      const places = this.props.places;
      var placeButtons = [];

      places.map((placesID) => {
        db.getPlace(placesID).then((place) => {
          placeButtons.push(
            <View key={placesID}>
              <TouchableHighlight
                onPress={() => this.showPlace(placesID, place)}
                style={styles.place}
              >
                <Image
                  source={require("../../../assets/images/vet.jpg")}
                  style={styles.placeImage}
                ></Image>
              </TouchableHighlight>
            </View>
          );
          if (this.state.mounted) {
            this.setState({ places: placeButtons });
          }
        });
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.places != null) {
      return this.state.places;
    } else {
      return <Text style={{ textAlign: "center" }}>Add new place</Text>;
    }
  }
}

const styles = StyleSheet.create({
  pet: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "orange",
  },

  place: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    flex: 1,
    borderRadius: 35,
    backgroundColor: "lightgreen",
  },
  placeImage: {
    width: "100%",
    height: 150,
    borderRadius: 35,
    resizeMode: "cover",
  },
});
export default PlaceButton;
