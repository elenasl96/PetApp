import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  ImageBackground,
} from "react-native";
import dbLostPet from "../../firebase/Database/Functions/dbLostPet";
import { AuthContext } from "../../Components/AuthContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";

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

  showLostPet = (animal) => {
    if (this.props.closeModal) {
      this.props.closeModal();
    }
    this.props.navigation.push("LostPet", {
      pet: animal,
      petID: animal.id,
      seen: false,
    });
  };

  render() {
    if (this.state.lostPets.length > 0) {
      return this.state.lostPets.map((animal) => (
        <TouchableOpacity
          key={animal.id}
          style={{
            backgroundColor: "#f8edeb",
            flexBasis: 400,
            minWidth: 350,
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 25,
            elevation: 2,
          }}
          value={animal.id}
          onPress={() => this.showLostPet(animal)}
        >
          <View
            style={{
              flex: 1,
              flexBasis: 400,
              flexDirection: "row",
              borderRadius: 100,
            }}
          >
            <Image
              source={{ uri: animal.photo }}
              style={styles.petImage}
              imageStyle={{
                borderTopLeftRadius: 25,
                borderBottomLeftRadius: 25,
              }}
            ></Image>

            <View style={styles.textContainer}>
              <Text style={styles.name}>{animal.getName()}</Text>
              <Text style={styles.place}>
                <Entypo name="location-pin" size={18} color="#83c5be" />
                {animal.getPlace()}
              </Text>
              <Text style={styles.time}>
                <Entypo name="clock" size={16} color="#83c5be" />{" "}
                {animal.getTimestamp().substr(0, 10)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
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
    width: 150,
    height: 150,
    height: 150,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
  },
  name: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#ffb4a2",
  },
  place: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    flexWrap: "wrap",
    color: "#6d6875",
  },
  time: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    color: "#6d6875",
  },
  overlay: {
    backgroundColor: "rgba(150, 150, 150, 0)",
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});
export default PetLostButton;
