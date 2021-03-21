import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  ImageBackground,
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
                <ImageBackground
                  source={require("../../../assets/images/vet.jpg")}
                  style={styles.placeImage}
                  imageStyle={{ borderRadius: 20 }}
                >
                  <View style={styles.overlay}>
                    <Text
                      style={[
                        styles.title,
                        {
                          color: "white",
                          textShadowColor: "black",
                          textShadowRadius: 2,
                          alignSelf: "center",
                        },
                      ]}
                    >
                      OOOP
                    </Text>
                  </View>
                </ImageBackground>
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
  place: {
    width: "100%",
    elevation: 2,
    marginVertical: 7,
    borderRadius: 20,
  },

  placeImage: {
    width: "100%",
    height: 150,
    borderRadius: 20,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    width: "100%",
    height: "100%",
  },
});
export default PlaceButton;
