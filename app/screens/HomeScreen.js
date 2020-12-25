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
class HomeScreen extends React.Component {
  static contextType = AuthContext;
  //state = { user: {} };
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.context.saveUserUID(user.uid);
        console.log("context:");
        console.log(this.context);
      }
    });
  }

  render() {
    const showPet = () => {
      this.props.navigation.navigate("Pet");
    };

    const showPlace = () => {
      this.props.navigation.navigate("Pet");
    };

    const showKennel = () => {
      this.props.navigation.navigate("Kennel");
    };

    const showVet = () => {
      this.props.navigation.navigate("Vet");
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.feedContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.feed}>
                  <Text>Feed1</Text>
                </View>
                <View style={styles.feed}>
                  <Text>Feed1</Text>
                </View>
                <View style={styles.feed}>
                  <Text>Feed1</Text>
                </View>
              </ScrollView>
            </View>

            <View style={styles.myPetsContainer}>
              <Text style={styles.title}>My Pets</Text>
              <View style={styles.myPets}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <TouchableHighlight onPress={showPet}>
                    <View style={styles.pet}>
                      <Image
                        source={require("../../assets/images/Gioia.jpg")}
                        style={styles.petImage}
                      ></Image>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showPet}>
                    <View style={styles.pet}>
                      <Image
                        source={require("../../assets/images/Cipolla.jpg")}
                        style={styles.petImage}
                      ></Image>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showPet}>
                    <View style={styles.pet}></View>
                  </TouchableHighlight>
                </ScrollView>
              </View>
            </View>

            <View style={styles.myPetsContainer}>
              <Text style={styles.title}>My Favourite Places</Text>
              <View style={styles.myPlaces}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <TouchableHighlight onPress={showKennel}>
                    <View style={styles.place}></View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showVet}>
                    <View style={styles.place}></View>
                  </TouchableHighlight>

                  <TouchableHighlight onPress={showPlace}>
                    <View style={styles.place}></View>
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
  feedContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,

    backgroundColor: "powderblue",
  },
  feed: {
    width: 300,
    height: 250,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
  },
  myPetsContainer: {
    flexDirection: "column",
  },
  title: {
    marginLeft: 15,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  myPets: {
    flexWrap: "nowrap",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
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
  myPlaces: {
    flexWrap: "nowrap",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
    marginLeft: 15,
    width: 300,
    height: 150,
    borderRadius: 35,
    backgroundColor: "lightgreen",
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
export default HomeScreen;
