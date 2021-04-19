import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import firebase from "firebase";
import dbUserAnimal from "../../firebase/Database/Functions/dbUserAnimal";
import { AuthContext } from "../AuthContext";
import dbAdoptableAnimal from "../../firebase/Database/Functions/dbAdoptableAnimal";

class PetButton extends React.Component {
  state = {
    pet: null,
    mounted: true,
  };

  // static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    const navigation = this.props.navigation;
    const pets = this.props.pets;
    const isAdoptable = this.props.isAdoptable;
    var petButtons = [];

    if (!isAdoptable) {
      pets.map((petID) => {
        dbUserAnimal.getUserAnimal(this.props.uid, petID).then((animal) => {
          petButtons.push(
            <TouchableHighlight
              style={styles.pet}
              value={petID}
              key={petID}
              onPress={() =>
                navigation.push("Pet", {
                  pet: animal,
                  petID: petID,
                  deleteAnimal: this.props.deleteAnimal,
                })
              }
            >
              <Image
                source={{ uri: animal.photo }}
                style={styles.petImage}
              ></Image>
            </TouchableHighlight>
          );
          if (this.state.mounted) {
            this.setState({ pet: petButtons });
          }
        });
      });
    } else {
      const pid = this.props.pid;
      console.log("isAdoptable: " + isAdoptable);
      pets.map((petID) => {
        dbAdoptableAnimal
          .getAdoptableAnimal(pid, petID.toString())
          .then((animal) => {
            petButtons.push(
              <TouchableHighlight
                style={styles.pet}
                value={petID}
                key={petID}
                onPress={() =>
                  navigation.push("Pet", {
                    pet: animal,
                    petID: petID.toString(),
                    pid: pid,
                    isAdoptable: isAdoptable,
                  })
                }
              >
                <Image
                  source={{ uri: animal.photo }}
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

  render() {
    if (this.state.mounted) {
      return this.state.pet;
    }
  }
}

const styles = StyleSheet.create({
  pet: {
    marginHorizontal: 10,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "orange",
    elevation: 5,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
});

export default PetButton;
