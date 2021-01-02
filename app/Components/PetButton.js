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
import db from "../firebase/DatabaseManager";

class PetButton extends React.Component {
  static contextType = AuthContext;

  state = {
    pets: [],
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.getUserAnimals(this.context.uid).then((pets) =>
          this.setState({ pets: pets })
        );
      }
    });
  }

  showPet = () => {
    this.props.navigation.navigate("Pet");
  };

  render() {
    const navigation = this.props.navigation;
    console.log(this.state.pets);
    var petButtons = [];
    this.state.pets.map((pet, i) =>
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
