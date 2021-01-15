import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import db from "../../firebase/DatabaseManager";

class PlaceButton extends React.Component {
  state = {
    places: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (this.state.places == null && this.state.mounted) {
      const navigation = this.props.navigation;
      const places = this.props.places;
      if (places == undefined) return;
      var placeButtons = [];

      pets.map((petID) => {
        db.getPlaces().then((places) => {
          placeButtons.push(
            <View key={petID}>
              <TouchableHighlight
                style={{
                  backgroundColor: "orange",

                  width: 180,
                  height: 240,
                  marginLeft: 10,
                  marginBottom: 10,
                  borderRadius: 35,
                  padding: 10,
                }}
                value={petID}
                onPress={() =>
                  navigation.push("LostPet", {
                    pet: animal,
                    petID: petID,
                  })
                }
              >
                <View>
                  <Image
                    source={require("../../../assets/images/Gioia.jpg")}
                    style={styles.petImage}
                  ></Image>
                  <View style={{ padding: 5 }}>
                    <Text>{animal.getName()}</Text>
                    <Text>{animal.getPlace()}</Text>
                    <Text>{animal.getTimestamp()}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          );
          if (this.state.mounted) {
            this.setState({ lostPets: lostPetsButtons });
          }
        });
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.lostPets != null) {
      return this.state.lostPets;
    } else {
      return <Text>No Pet Lost</Text>;
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
  petImage: {
    width: "100%",
    height: 150,
    borderRadius: 25,
    resizeMode: "cover",
  },
});
export default PlaceButton;