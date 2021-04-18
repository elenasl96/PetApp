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
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import dbFeed from "../firebase/Database/Functions/dbFeed";
import dbPlace from "../firebase/Database/Functions/dbPlace";
import PlaceButton from "../Components/Buttons/PlaceButton";
import FeedBox from "../Components/Custom/FeedBox";
import NotificationsHandler from "../Components/NotificationsHandler";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AddPetForm from "../Components/Forms/AddPetForm";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";

class HomeScreen extends React.Component {
  state = {
    pets: [],
    places: [],
    feeds: [],
    mounted: false,
    showPetForm: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    //console.log("REMOUNTED");
    this.setState({ mounted: true });
    //db.populateDb();  --- for populate the db
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dbUserAnimal.getUserAnimals(this.context.uid).then((pets) => {
          if (this.state.mounted) {
            this.setState({ pets: pets });
          }
          var info = this.context.user;
          var animals = [];
          var uid = this.context.uid;
          if (pets.length != 0) {
            pets.forEach((aid) => {
              dbUserAnimal.getUserAnimal(uid, aid).then((animal) => {
                animals.push(animal);
                if (pets.length == animals.length) {
                  let promise = new Promise((resolve, reject) => {
                    dbFeed.addRandomFeeds(animals, uid, info.getLastLogin(), 0);
                    setTimeout(() => {
                      resolve();
                    }, 1000);
                  });
                  promise.then(() => {
                    dbFeed.getUserFeeds(uid).then((feeds) => {
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
              dbFeed.addRandomFeeds(
                animals,
                uid,
                info.getLastLogin(),
                info.days
              );
              setTimeout(() => {
                resolve();
              }, 1000);
            });
            promise.then(() => {
              dbFeed.getUserFeeds(uid).then((feeds) => {
                if (this.state.mounted) {
                  this.setState({ feeds: feeds });
                  this.setState({ mounted: true });
                }
              });
            });
          }
        });
        var places = [];
        dbPlace.getSavedPlaces(this.context.uid).then((placeIds) => {
          placeIds.forEach((placeId) => {
            dbPlace
              .getSavedPlace(this.context.uid, placeId)
              .then((savedPlace) => {
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

  showPetForm = () => {
    if (this.state.mounted) {
      this.setState({ showPetForm: true });
    }
  };

  addPet = (petID) => {
    this.state.pets.push(petID);
    console.log(this.state.pets);
    this.setState({ pets: this.state.pets });
  };

  deletePet = (petID) => {
    dbUserAnimal.deleteAnimal(this.context.uid, petID);
    let petsUpdated = this.state.pets;
    let index = petsUpdated.indexOf(petID);
    if (index != -1) {
      petsUpdated.splice(index, 1);
    }
    console.log(petsUpdated);
    this.setState({ pets: petsUpdated });
  };

  showPet = () => {
    this.props.navigation.navigate("Pet", {
      deletePet: this.deletePet(),
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AddPetForm
          visible={this.state.showPetForm}
          close={() => {
            this.setState({ showPetForm: false });
          }}
          addPet={this.addPet}
        ></AddPetForm>
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
                      deleteAnimal={this.deletePet}
                      type="useranimal"
                    ></PetButton>
                  ) : (
                    <Text style={styles.largeText}>Your pets</Text>
                  )}

                  <TouchableHighlight
                    onPress={this.showPetForm}
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
