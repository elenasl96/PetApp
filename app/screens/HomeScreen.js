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
import PetButton from "../Components/Buttons/PetButton";
import db from "../firebase/DatabaseManager";
import PlaceButton from "../Components/Buttons/PlaceButton";
import FeedBox from "../Components/FeedBox";
import NotificationsHandler from "../Components/NotificationsHandler";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

class HomeScreen extends React.Component {
  state = {
    pets: [],
    places: [],
    feeds: [],
    mounted: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.getUserAnimals(this.context.uid).then((pets) => {
          if (this.state.mounted) {
            this.setState({ pets: pets });
          }
          var info = this.context.user;
          var animals = [];
          var uid = this.context.uid;
          if (pets.length != 0) {
            pets.forEach((aid) => {
              db.getUserAnimal(uid, aid).then((animal) => {
                animals.push(animal);
                if (pets.length == animals.length) {
                  let promise = new Promise((resolve, reject) => {
                    db.addRandomFeeds(animals, uid, info.getLastLogin(), 0);
                    setTimeout(() => {
                      resolve();
                    }, 1000);
                  });
                  promise.then(() => {
                    db.getUserFeeds(uid).then((feeds) => {
                      if (this.state.mounted) {
                        this.setState({ feeds: feeds });
                        this.setState({ mounted: true });
                      }
                    });
                  });
                }
              });
            });
          } else {
            let promise = new Promise((resolve, reject) => {
              db.addRandomFeeds(animals, uid, info.getLastLogin(), info.days);
              setTimeout(() => {
                resolve();
              }, 1000);
            });
            promise.then(() => {
              db.getUserFeeds(uid).then((feeds) => {
                if (this.state.mounted) {
                  this.setState({ feeds: feeds });
                  this.setState({ mounted: true });
                }
              });
            });
          }
        });
        var places = [];
        db.getSavedPlaces(this.context.uid).then((placeIds) => {
          placeIds.forEach((placeId) => {
            db.getSavedPlace(this.context.uid, placeId).then((savedPlace) => {
              places.push(savedPlace);
              if (this.state.mounted) {
                this.setState({ places: places });
              }
            });
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    const addPet = () => {
      this.props.navigation.navigate("AddPet");
    };

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
        <NotificationsHandler></NotificationsHandler>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.feedContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {this.state.feeds.length > 0 ? (
                  <FeedBox
                    uid={this.context.uid}
                    feeds={this.state.feeds}
                  ></FeedBox>
                ) : null}
              </ScrollView>
            </View>

            <View style={styles.myPetsContainer}>
              <View style={styles.myPets}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {this.state.pets.length > 0 ? (
                    <PetButton
                      uid={this.context.uid}
                      pets={this.state.pets}
                      //pets = {this.context.pets}
                      navigation={this.props.navigation}
                    ></PetButton>
                  ) : (
                    <Text style={styles.largeText}>Your pets</Text>
                  )}

                  <TouchableHighlight
                    onPress={addPet}
                    style={styles.addPetButton}
                  >
                    <AntDesign name="plus" size={50} style={styles.plus} />
                  </TouchableHighlight>
                </ScrollView>
              </View>
            </View>

            <View style={styles.myPlaceContainer}>
              <Text style={styles.largeText}>Your Places</Text>
              {/*} <View style={styles.myPlaces}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  > */}
              <PlaceButton
                uid={this.context.uid}
                places={this.state.places}
                navigation={this.props.navigation}
              ></PlaceButton>
              {/*    </ScrollView>
              </View> */}
            </View>
          </ScrollView>
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
    backgroundColor: "white",
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

  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
  addPetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  plus: {
    color: "#F3722C",
  },
  myPlaceContainer: {
    flexDirection: "column",
    paddingHorizontal: 0,
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
  placeImage: {
    width: 300,
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
  largeText: {
    fontSize: 30,
    marginHorizontal: 10,
    marginVertical: 5,
  },
});
export default HomeScreen;
