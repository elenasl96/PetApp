import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
  TouchableHighlightComponent,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import firebase from "firebase";
import { AuthContext } from "../../Components/AuthContext";
import dbPlace from "../../firebase/Database/Functions/dbPlace.js";
import dbAdoptableAnimal from "../../firebase/Database/Functions/dbAdoptableAnimal.js";
import PlaceButton from "../../Components/Buttons/PlaceButton";
import AddPlaceForm from "../../Components/Forms/AddPlaceForm";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class HomeBusiness extends React.Component {
  state = {
    places: [],
    mounted: false,
    showPlaceForm: false,
    onDelete: false,
    update: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    this.getMyPlaces(this.context.places);
  }

  getMyPlaces(places) {
    let promises = places.map((placeID) => {
      return dbPlace.getPlace(placeID).then((place) => {
        /*
        if(place.isKennel()){
         dbAdoptableAnimal.getAdoptableAnimals(placeID).then((animals) => {
                 this.context.saveAdoptablePets(placeID,animals);
         });
        }*/
        place.id = placeID;
        return place;
      });
    });

    Promise.all(promises).then((places) => {
      if (this.state.mounted) {
        this.setState({ places: places });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (!this.state.showPlaceForm && prevState.showPlaceForm) ||
      this.state.onDelete
    ) {
      this.getMyPlaces(this.context.places);
      if (this.state.onDelete) {
        this.setState({ onDelete: false });
      }
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  addPlace = () => {
    if (this.state.mounted) {
      this.setState({ showPlaceForm: true });
    }
  };

  deletePlace = (pid) => {
    dbPlace.deletePlace(pid); // delete place from db
    dbPlace.deleteMyPlace(this.context.uid, pid); // delete MyPlace from db
    this.context.deletePlace(pid); // delete place from context
    this.setState({ onDelete: true });

    //delete place from map
    let index = this.context.globalPlaces.indexOf(pid);
    if (index !== -1) {
      this.context.globalPlaces.splice(index, 1);
      this.context.saveGlobalPlaces(this.context.globalPlaces);
    }
  };

  render() {
    const showPlace = () => {
      this.props.navigation.navigate("Pet");
    };
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AddPlaceForm
          visible={this.state.showPlaceForm}
          close={() => {
            this.setState({ showPlaceForm: false, update: true });
          }}
        ></AddPlaceForm>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <View style={styles.titleBox}>
                <Image
                  style={{ width: 70, height: 70 }}
                  source={require("../../../assets/images/draws/pet-shop(2).png")}
                ></Image>
                <Text style={styles.title}>My Places </Text>
                <TouchableOpacity
                  onPress={this.addPlace}
                  style={styles.addPetButton}
                >
                  <AntDesign name="plus" size={50} style={styles.plus} />
                </TouchableOpacity>
              </View>
              <Text style={styles.text}>
                Register your places to show them in the map. It can be a
                veterinary, a kennel, a park, or other type of place related to
                pets.
              </Text>

              <ScrollView
                style={{ width: "100%" }}
                vertical={true}
                showsHorizontalScrollIndicator={false}
              >
                <View style={styles.myPlaces}>
                  {this.state.places.length > 0 ? (
                    <PlaceButton
                      uid={this.context.uid}
                      places={this.state.places}
                      navigation={this.props.navigation}
                      deletePlace={this.deletePlace}
                    ></PlaceButton>
                  ) : null}
                </View>
              </ScrollView>
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
  placeButton: {
    width: 80,
    height: 80,
    borderRadius: 75,
    backgroundColor: "orange",
    alignSelf: "center",
    marginBottom: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 75,
    resizeMode: "cover",
    margin: 15,
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
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginLeft: 15,
    //marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  titleBox: {
    flex: 1,
    flexDirection: "row",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 15,
    width: "70%",
  },
  myPlaces: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 20,
    backgroundColor: "white",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
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
  addPetButton: {
    borderRadius: 25,
    marginLeft: 10,
  },
});
