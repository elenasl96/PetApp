import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import firebase from "firebase";
import { AuthContext } from "../Components/AuthContext";

class PetButton extends React.Component {
  static contextType = AuthContext;

  showPet = () => {
    this.props.navigation.navigate("Pet");
  };

  render() {
    const navigation = this.props.navigation;
    const pets = this.props.pets;
    console.log(pets);
    var petButtons = [];
    pets.map((pet, i) =>
      petButtons.push(
        <TouchableHighlight
          style={styles.pet}
          value={i}
          key={i}
          onPress={() =>
            navigation.push("Pet", {
              pet: pet,
            })
          }
        >
          <Image
            source={require("../../assets/images/Gioia.jpg")}
            style={styles.petImage}
          ></Image>
        </TouchableHighlight>
      )
    );
    {
      /*} for (var i = 0; i < this.state.pets.length; i++) {
      petButtons.push(
        <View value={i} key={"viewButton" + i}>
          <TouchableHighlight
            style={styles.pet}
            value={i}
            key={i}
            onPress={
              () => {
              console.log("AAA");
              console.log(this.props.value);
              navigation.push("Pet", {
                pet: this.state.pets[i],
              });
            }} 
        
          >
            <Image
              source={require("../../assets/images/Gioia.jpg")}
              style={styles.petImage}
            ></Image>
          </TouchableHighlight>
        </View>
      );
    } */
    }
    return petButtons;
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
