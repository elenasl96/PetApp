import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import firebase from "firebase";
import { AuthContext } from "../components/custom/ContextProvider";
import PetButton from "../components/buttons/PetButton";
import dbUserAnimal from "../firebase/database/functions/DbUserAnimal";
import dbFeed from "../firebase/database/functions/DbFeed";
import dbPlace from "../firebase/database/functions/DbPlace";
import PlaceButton from "../components/buttons/PlaceButton";
import FeedBox from "../components/custom/FeedBox";
import NotificationsHandler from "../components/custom/NotificationsHandler";
import { AntDesign } from "@expo/vector-icons";
import AddPetForm from "../components/forms/AddPetForm";
import dbAdoptableAnimal from "../firebase/database/functions/DbAdoptableAnimal";
import LoadingOverlay from "../components/custom/LoadingOverlay";
import mainStyle from "../styles/MainStyle";
import { TouchableOpacity } from "react-native-gesture-handler";

class HomeScreen extends React.Component {
  state = {
    pets: [],
    places: [],
    feeds: [],
    mounted: false,
    showPetForm: false,
    onDeletePet: false,
    loading: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true, loading: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.loadInfo();
      }
    });
  }

  loadInfo() {
    console.log("load info");
    this.getUserPets([], true);

    this.saveFavouritePlaces();

    if (this.context.user.type == "business") {
      this.getMyPlaces();
    }
  }

  getUserPets(pets, loadFeed) {
    // get user pets and feeds related to them
    if (loadFeed) {
      dbUserAnimal.getUserAnimals(this.context.uid).then((pets) => {
        this.getMyPets(pets); // converts ids in Animal objects
        this.context.savePets(pets);
        this.getUserFeeds(pets);
      });
    } else {
      if (pets.length != 0) {
        this.getMyPets(pets);
      } else {
        if (this.state.mounted) {
          this.setState({ pets: pets });
        }
      }
    }
  }

  getMyPets(pets) {
    let promises = pets.map((petID) => {
      return dbUserAnimal.getUserAnimal(this.context.uid, petID).then((pet) => {
        pet.id = petID;
        return pet;
      });
    });

    Promise.all(promises).then((pets) => {
      if (this.state.mounted) {
        this.setState({ pets: pets });
      }
    });
  }

  getUserFeeds(pets) {
    var info = this.context.user;

    var animals = [];
    var uid = this.context.uid;

    if (pets.length != 0) {
      pets.forEach((aid) => {
        dbUserAnimal.getUserAnimal(uid, aid).then((animal) => {
          animals.push(animal);
          if (pets.length == animals.length) {
            dbFeed
              .getFeeds(animals, uid, info.getLastLogin(), info.getDays())
              .then((feeds) => {
                if (this.state.mounted) {
                  this.setState({ feeds: feeds, loading: false });
                }
              });
          }
        });
      });
    } else {
      dbFeed
        .getFeeds(animals, uid, info.getLastLogin(), info.getDays())
        .then((feeds) => {
          if (this.state.mounted) {
            this.setState({ feeds: feeds, loading: false });
          }
        });
    }
  }

  saveFavouritePlaces() {
    dbPlace.getSavedPlaces(this.context.uid).then((places) => {
      if (this.state.mounted) {
        this.context.saveFavouritePlaces(places);
        this.getMySavedPlaces(places);
      }
    });
  }

  getMySavedPlaces(placeIDs) {
    var places = [];
    placeIDs.map((placeID) => {
      dbPlace.getPlace(placeID).then((place) => {
        if (place == null) {
          dbPlace.deleteSavedPlace(this.context.uid, placeID);
          this.context.deleteFavouritePlace(placeID);
        } else {
          place.id = placeID;
          places.push(place);
        }
        if (places.length == placeIDs.length && this.state.mounted) {
          this.setState({ places: places });
        }
      });
    });
    if (placeIDs.length == 0) {
      this.setState({ places: [] });
    }
  }

  getMyPlaces() {
    dbPlace.getMyPlaces(this.context.uid).then((PIDs) => {
      if (this.state.mounted) {
        this.context.savePlaces(PIDs);
      }
      PIDs.map((placeID) => {
        dbPlace.getPlace(placeID).then((place) => {
          if (place.isKennel()) {
            dbAdoptableAnimal.getAdoptableAnimals(placeID).then((animals) => {
              this.context.saveAdoptablePets(placeID, animals);
            });
          }
        });
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.places.length !== this.context.savedPlaces.length) {
      this.getMySavedPlaces(this.context.savedPlaces);
    }

    if (this.state.pets.length != this.context.pets.length) {
      this.getUserPets(this.context.pets, false);
    }
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
    if (this.state.mounted) {
      this.setState({ pets: this.state.pets });
    }
  };

  deletePet = (petID) => {
    dbUserAnimal.deleteAnimal(this.context.uid, petID);
    this.context.deletePet(petID);
    if (this.state.mounted) {
      this.setState({ onDeletePet: true });
    }
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
        <LoadingOverlay visible={this.state.loading}></LoadingOverlay>

        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  this.loadInfo();
                }}
              />
            }
          >
            <View style={styles.horizontalContainer}>
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

            <View style={styles.horizontalContainer}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View>
                  <Image
                    style={styles.dogHouse}
                    source={require("../../assets/images/draws/pet.png")}
                  ></Image>
                  <Text style={styles.largeText}>Pets</Text>
                </View>

                {this.state.pets.length > 0 ? (
                  <PetButton
                    uid={this.context.uid}
                    pets={this.state.pets}
                    navigation={this.props.navigation}
                    deleteAnimal={this.deletePet}
                    type="useranimal"
                  ></PetButton>
                ) : null}

                <TouchableOpacity
                  onPress={this.showPetForm}
                  style={styles.addPetButton}
                >
                  <AntDesign name="plus" size={50} style={styles.plus} />
                </TouchableOpacity>
              </ScrollView>
            </View>

            {this.state.places.length > 0 ? (
              <View style={styles.horizontalContainer}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View>
                    <Image
                      style={[
                        styles.dogHouse,
                        { width: 100, height: 100, alignSelf: "center" },
                      ]}
                      source={require("../../assets/images/draws/paw.png")}
                    ></Image>
                    <Text style={[styles.largeText, { textAlign: "center" }]}>
                      Favourite{"\n"} places
                    </Text>
                  </View>
                  <PlaceButton
                    uid={this.context.uid}
                    places={this.state.places}
                    navigation={this.props.navigation}
                    isSavedPlace={true}
                  ></PlaceButton>
                </ScrollView>
              </View>
            ) : (
              <View
                style={[
                  mainStyle.box,
                  {
                    marginHorizontal: 20,
                    backgroundColor: "#fff1e6",
                    flexBasis: 300,
                    width: "95%",
                    maxWidth: 500,
                    alignSelf: "center",
                  },
                ]}
              >
                <Text style={[styles.text, { color: "#6d6875" }]}>
                  You can explore veterinaries, kennels, parks and other places
                  in the map. Click the star button to keep them in your
                  favourites!
                </Text>
              </View>
            )}
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
    justifyContent: "flex-start",
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
    fontFamily: "Roboto",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Roboto",
    margin: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    resizeMode: "cover",
  },
  horizontalContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 10,
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

  title: {
    marginLeft: 15,
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 20,
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
    justifyContent: "center",
  },
  myPlaces: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
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
    marginBottom: 10,
    alignSelf: "center",
  },
  dogHouse: {
    width: 120,
    height: 120,
    marginHorizontal: 15,
  },
  text: {
    width: "80%",
    alignSelf: "center",
    textAlign: "center",
  },
});
export default HomeScreen;
