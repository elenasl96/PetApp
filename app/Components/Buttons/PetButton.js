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
//import Animal from "../firebase/Animal.js";

class PetButton extends React.Component {
  state = {
    pet: null,
    mounted: true,
    //prevState: [],
  };

  // static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    //console.log(this.state.pet);
    const navigation = this.props.navigation;
    const pets = this.props.pets;
    const isAdoptable = this.props.isAdoptable;
    var petButtons = [];

    if (!isAdoptable){

    pets.map((petID) => {
      dbUserAnimal.getUserAnimal(this.props.uid, petID).then((animal) => {
        //console.log("Adding animal: " + animal.name);
        dbUserAnimal.getAnimalStatSamples(this.props.uid, petID, "weight").then(
          (WIDs) => {
            // WID weight sample id
            dbUserAnimal.getAnimalStatSamples(this.props.uid, petID, "height").then(
              (HIDs) => {
                // HID height sample id
                dbUserAnimal.getAnimalDiseases(this.props.uid, petID).then((DIDs) => {
                  //DID disease id
                  petButtons.push(
                    <TouchableHighlight
                      style={styles.pet}
                      value={petID}
                      key={petID}
                      onPress={() =>
                        navigation.push("Pet", {
                          pet: animal,
                          petID: petID,
                          WIDs: WIDs,
                          HIDs: HIDs,
                          DIDs: DIDs,
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
              }
            );
          }
        );
      });
    });
   }
   else{
    const place = this.props.place;

    pets.map((petID) => {
          dbAdoptableAnimal.getAdoptableAnimal(place, petID.toString()).then((animal) => {
            console.log("Adding animal: " + animal.name);

                    dbAdoptableAnimal.getAdoptableAnimalDiseases(place,petID.toString()).then((DIDs) => {
                      //DID disease id
                      petButtons.push(
                        <TouchableHighlight
                          style={styles.pet}
                          value={petID}
                          key={petID}
                          onPress={() =>
                            navigation.push("AdoptablePet", {
                              pet: animal,
                              petID: petID.toString(),
                              DIDs: DIDs,
                              place: place
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
              });

          }
  }
  /*
  useEffect(() => {
    console.log("Context change detected!");
    changePetButtons(this.context.pets);
  }, [this.context.pets]);
  */

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
