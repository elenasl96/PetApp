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
    onDeletePet: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        this.getUserPets([],true);

        this.saveFavouritePlaces();

        if (this.context.user.type == "business") {
          this.getMyPlaces();
          //this.getMyAdoptablePets();
        }
      }
    });
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
        this.setState({ pets: pets });
      }
    }
  }

  getMyPets(pets) {

    let promises = pets.map((petID) => {
      //console.log("ENTER MAP");
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
                }
              });
            });
          }
        });
      });
    } else {
      let promise = new Promise((resolve, reject) => {
        dbFeed.addRandomFeeds(animals, uid, info.getLastLogin(), info.days);
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      promise.then(() => {
        dbFeed.getUserFeeds(uid).then((feeds) => {
          if (this.state.mounted) {
            this.setState({ feeds: feeds });
          }
        });
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

  getMySavedPlaces(placeIDs){
   /*
   let promises = places.map((placeID) => {
         return dbPlace.getPlace(placeID).then((place) => {
           place.id = placeID;
           return place;
         });
       });
        Promise.all(promises).then((places) => {
            this.setState({places:places});
        });*/
      var places = [];
      placeIDs.map((placeID) => {
         dbPlace.getPlace(placeID).then((place) => {
                 if(place == null){
                   dbPlace.deleteSavedPlace(this.context.uid,placeID);
                   this.context.deleteFavouritePlace(placeID);
                 }
                 else{
                 place.id = placeID;
                 places.push(place);
                 }
                 if(places.length == placeIDs.length){
                   this.setState({places:places});
                 }
         });
     });
 }

  getMyPlaces() {
    dbPlace.getMyPlaces(this.context.uid).then((PIDs) => {
      if (this.state.mounted) {
        this.context.savePlaces(PIDs);
      }
      PIDs.map((placeID) => {
       dbPlace.getPlace(placeID).then((place) => {
              if(place.isKennel()){
               dbAdoptableAnimal.getAdoptableAnimals(placeID).then((animals) => {
                       this.context.saveAdoptablePets(placeID,animals);
               });
              }
       });
     });
   });
  }
/*
  getMyAdoptablePets() {
    let places = this.context.places;

    dbPlace.getMyPlaces(this.context.uid).then((PIDs) => {
      if (this.state.mounted) {
        this.context.savePlaces(PIDs);
      }
    });
  }*/

  componentDidUpdate(prevProps, prevState) {
    if (this.state.places.length != this.context.savedPlaces.length) {
      //console.log("COMPONENT DID UPDATE FOR SAVEDPLACES");
      this.getMySavedPlaces(this.context.savedPlaces);
    }

    if (this.state.pets.length != this.context.pets.length) {
      //console.log("COMPONENT DID UPDATE FOR PETS");
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
    this.setState({ onDeletePet: true });
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
                  horizontal={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <Text style={styles.largeText}>Your pets</Text>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {this.state.pets.length > 0 ? (
                      <PetButton
                        uid={this.context.uid}
                        pets={this.state.pets}
                        navigation={this.props.navigation}
                        deleteAnimal={this.deletePet}
                        type="useranimal"
                      ></PetButton>
                    ) : null}

                    <TouchableHighlight
                      onPress={this.showPetForm}
                      style={styles.addPetButton}
                    >
                      <AntDesign name="plus" size={50} style={styles.plus} />
                    </TouchableHighlight>
                  </ScrollView>
                </ScrollView>
              </View>
            </View>

            <View style={styles.myPlaceContainer}>
              <Text style={styles.largeText}>Your Favourite Places</Text>

              {this.state.places.length > 0 ? (

                 <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                <PlaceButton
                  uid={this.context.uid}
                  places={this.state.places}
                  navigation={this.props.navigation}
                  isSavedPlace={true}
                ></PlaceButton>
                 </ScrollView>

              ) : null}

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
    //paddingHorizontal: 0,
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
