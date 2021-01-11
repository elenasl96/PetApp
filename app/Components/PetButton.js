import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import firebase from "firebase";
import db from "../firebase/DatabaseManager.js";
import { AuthContext } from "../Components/AuthContext";

class PetButton extends React.Component {
  state = {
    pet: null,
    mounted: true,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (this.state.pet == null && this.state.mounted) {
      const navigation = this.props.navigation;
      const pets = this.props.pets;
      var petButtons = [];

      pets.map((petID) => {
        db.getUserAnimal(this.props.uid, petID).then((animal) => {
          petButtons.push(
            <TouchableHighlight
              style={styles.pet}
              value={petID}
              key={petID}
              onPress={() =>
                navigation.push("Pet", {
                  pet: animal,
                  petID: petID,
                })
              }
            >
              <Image
                source={require("../../assets/images/Gioia.jpg")}
                style={styles.petImage}
              ></Image>
            </TouchableHighlight>
          );
          if (this.state.mounted) {
            this.setState({ pet: petButtons });
          }
        });
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  showPet = () => {
    this.props.navigation.navigate("Pet");
  };

  render() {
    console.log("pet buttons");
    console.log(this.state.pet);
    return this.state.pet;
  }
}

const styles = StyleSheet.create({
  pet: {
    marginLeft: 15,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "orange",
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
});
export default PetButton;
