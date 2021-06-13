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
import { Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

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
        <TouchableOpacity
          key={animal.id}
          style={{
            backgroundColor: "#eaf4f4",
            flexBasis: 400,
            minWidth: 350,
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 25,
            elevation: 2,
          }}
          value={animal.id}
          onPress={() =>
            this.props.navigation.push("LostPet", {
              pet: animal,
              petID: animal.id,
              seen: true,
            })
          }
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
});
export default PetLostSeenButton;
