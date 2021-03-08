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
    prevState: null,
  };

  static contextType = AuthContext;


  componentDidMount() {
    this.setState({ mounted: true });
    console.log(this.context.pets);
  }

  componentDidUpdate() {
    var pets = this.context.pets;
    console.log("Listen");
    if ( (this.state.pet == null || this.state.prevState.length != pets.length) && this.state.mounted) {
      console.log("Update!");
      const navigation = this.props.navigation;
      console.log("PrevState:" + this.state.prevState);
      this.state.prevState = pets;
      console.log("Pets:" + pets);

      //const pets = this.props.pets;
      //const pets = this.context.pets;
      var petButtons = [];

      pets.map((petID) => {
        db.getUserAnimal(this.props.uid, petID).then((animal) => {
          console.log(animal);
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

  showPet = () => {
    this.props.navigation.navigate("Pet");
  };

  render() {
    if (this.state.mounted) {
      return this.state.pet;
    }
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
