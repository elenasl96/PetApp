import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import firebase from "firebase";
import { AuthContext } from "../Components/AuthContext";
import PetButton from "../Components/PetButton";
import db from "../firebase/DatabaseManager";
import PetLostButton from "../Components/Buttons/PetLostButton";

export default class LostPetsScreen extends React.Component {
  state = {
    lostPets: null,
    mounted: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    if (this.state.lostPets == null) {
      db.getLostPetNotifications().then((lostPetsIDs) => {
        if (this.state.mounted) {
          console.log("lostpets");
          console.log(lostPetsIDs);
          this.setState({ lostPets: lostPetsIDs });
        }
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <Text style={styles.title}>Lost Pets</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <PetLostButton
                  navigation={this.props.navigation}
                  pets={this.state.lostPets}
                ></PetLostButton>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomMenu}>
          <TouchableHighlight onPress={null}>
            <View style={styles.mainButtonContainer}>
              <Image
                source={require("../../assets/images/paw.png")}
                style={styles.mainButton}
              ></Image>
            </View>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
    padding: 10,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    resizeMode: "cover",
  },

  myPlacesContainer: {
    flexDirection: "column",
  },
  title: {
    marginLeft: 15,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  myPlaces: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
    width: "100%",
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    flex: 1,
    borderRadius: 35,
    backgroundColor: "lightgreen",
  },
  placeImage: {
    width: "100%",
    height: 150,
    borderRadius: 35,
    resizeMode: "cover",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 100,
    right: 100,
    height: 70,
    alignItems: "center",
  },
  mainButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    tintColor: "orange",
  },
});
