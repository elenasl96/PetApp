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
    mounted: false,
  };

  static contextType = AuthContext;

  componentDidMount() {
      this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {

    const navigation = this.props.navigation;
    const pets = this.props.pets;
    const isAdoptable = this.props.isAdoptable;
    var isEditable = true; // the logic is : if it's not adoptable it's for sure editable
    var pid = null;

    if (isAdoptable) {
      isEditable = this.props.isEditable;
      pid = this.props.pid;
    }

          return pets.map((animal) => (
                <TouchableHighlight
                  style={styles.pet}
                  value={animal.id}
                  key={animal.id}
                  onPress={() =>
                    navigation.push("Pet", {
                      pet: animal,
                      petID: animal.id,
                      deleteAnimal: this.props.deleteAnimal,
                      isAdoptable: isAdoptable,
                      isEditable: isEditable,
                      pid: pid,
                    })
                  }
                >
                  <Image
                    source={{ uri: animal.photo }}
                    style={styles.petImage}
                  ></Image>
                </TouchableHighlight>
            ));
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
