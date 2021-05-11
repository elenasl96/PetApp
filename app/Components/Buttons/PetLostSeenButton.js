import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import dbLostPet from "../../firebase/Database/Functions/dbLostPet";
import { AuthContext } from "../../Components/AuthContext";

class PetLostSeenButton extends React.Component {
  state = {
    lostPetsSeen: [],
    mounted: false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (
      this.props.pets.length != this.state.lostPetsSeen.length &&
      this.state.mounted
    ) {
      const pets = this.props.pets;
      let promises = pets.map((petID) => {
        return dbLostPet.getLostPetSeen(petID).then((animal) => {
          animal.id = petID;
          return animal;
        });
      });

      Promise.all(promises).then((lostPetsSeen) => {
        if (this.state.mounted) {
          this.setState({ lostPetsSeen: lostPetsSeen });
        }
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.lostPetsSeen.length > 0) {
      return this.state.lostPetsSeen.map((animal) => (
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
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,

              elevation: 1,
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
              <Image
                source={{ uri: animal.photo }}
                style={styles.petImage}
              ></Image>
              <View style={{ padding: 5 }}>
                <Text>{animal.getPlace()}</Text>
                <Text>{animal.getTimestamp()}</Text>
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
  petImage: {
    width: "100%",
    height: 150,
    borderRadius: 25,
    resizeMode: "cover",
  },
});
export default PetLostSeenButton;
