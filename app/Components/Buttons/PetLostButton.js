import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import dbLostPet from "../../firebase/Database/Functions/dbLostPet";

class PetLostButton extends React.Component {
  state = {
    lostPets: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (this.state.lostPets == null && this.state.mounted) {
      const navigation = this.props.navigation;
      const pets = this.props.pets;
      if (pets == undefined) return;
      var lostPetsButtons = [];

      pets.map((petID) => {
        dbLostPet.getLostPetNotification(petID).then((animal) => {
          lostPetsButtons.push(
            <View key={petID}>
              <TouchableHighlight
                style={{
                  backgroundColor: "white",

                  width: 180,
                  height: 240,
                  marginLeft: 10,
                  marginBottom: 10,
                  borderRadius: 35,
                  padding: 10,
                  shadowColor: "#EEE",
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.18,
                  shadowRadius: 1.0,
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
                  <View style={styles.imageContainer}>
                    <Image
                      source={require("../../../assets/images/Gioia.jpg")}
                      style={styles.petImage}
                    ></Image>
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{animal.getName()}</Text>
                    <Text style={styles.text}>{animal.getPlace()}</Text>
                    <Text style={styles.text}>{animal.getTimestamp()}</Text>
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
      return <Text style={{ textAlign: "center" }}>No Pet Lost</Text>;
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
  imageContainer: {
    borderRadius: 120,
    elevation: 3,
  },
  petImage: {
    width: "100%",
    height: 150,
    borderRadius: 120,
    resizeMode: "cover",
  },
  textContainer: {
    padding: 5,
  },
  text: {
    textAlign: "center",
  },
});
export default PetLostButton;
