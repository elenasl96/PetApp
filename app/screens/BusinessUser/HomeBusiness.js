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
import { AuthContext } from "../../Components/AuthContext";
import PlusIcon from "../../Components/PlusIcon";
import PetButton from "../../Components/PetButton";
import db from "../../firebase/DatabaseManager";

export default class HomeBusiness extends React.Component {
  state = {
    places: [],
  };
  static contextType = AuthContext;

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.getPlaces(this.context.uid).then((places) =>
          this.setState({ places: places })
        );
      }
      console.log("Loading places");
      console.log(this.state);
    });
  }

  render() {
    const addPlace = () => {
      //this.props.navigation.navigate("AddPet");
    };

    const showPet = () => {
      this.props.navigation.navigate("Pet");
    };

    const showVet = () => {
      this.props.navigation.navigate("Vet");
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <Text style={styles.title}>My Places</Text>
              <View style={styles.myPlaces}>
                <ScrollView
                  vertical={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <TouchableHighlight onPress={showVet} style={styles.place}>
                    <Image
                      source={require("../../../assets/images/vet.jpg")}
                      style={styles.placeImage}
                    ></Image>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showVet} style={styles.place}>
                    <Image
                      source={require("../../../assets/images/vet.jpg")}
                      style={styles.placeImage}
                    ></Image>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showVet} style={styles.place}>
                    <Image
                      source={require("../../../assets/images/vet.jpg")}
                      style={styles.placeImage}
                    ></Image>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showVet} style={styles.place}>
                    <Image
                      source={require("../../../assets/images/vet.jpg")}
                      style={styles.placeImage}
                    ></Image>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showVet} style={styles.place}>
                    <Image
                      source={require("../../../assets/images/vet.jpg")}
                      style={styles.placeImage}
                    ></Image>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showVet} style={styles.place}>
                    <Image
                      source={require("../../../assets/images/vet.jpg")}
                      style={styles.placeImage}
                    ></Image>
                  </TouchableHighlight>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomMenu}>
          <TouchableHighlight onPress={null}>
            <View style={styles.mainButtonContainer}>
              <Image
                source={require("../../../assets/images/paw.png")}
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
    flexWrap: "nowrap",
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
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