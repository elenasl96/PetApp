import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import dbLostPet from "../../firebase/Database/Functions/dbLostPet";
import { AuthContext } from "../../Components/AuthContext";

class PetLostButton extends React.Component {
  state = {
    lostPets: [],
    mounted: false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (
      this.props.pets.length != this.state.lostPets.length &&
      this.state.mounted
    ) {
      const pets = this.props.pets;

      let promises = pets.map((petID) => {
        return dbLostPet.getLostPetNotification(petID).then((animal) => {
          animal.id = petID;
          return animal;
        });
      });

      Promise.all(promises).then((lostPets) => {
        if (this.state.mounted) {
          this.setState({ lostPets: lostPets });
        }
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    const navigation = this.props.navigation;
    if (this.state.lostPets.length > 0) {
      return this.state.lostPets.map((animal) => (
        <View key={animal.id}>
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
            value={animal.id}
            onPress={() =>
              navigation.push("LostPet", {
                pet: animal,
                petID: animal.id,
              })
            }
          >
            <View>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: animal.photo }}
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
      ));
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
