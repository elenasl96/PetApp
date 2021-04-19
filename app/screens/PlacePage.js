import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import dbNews from "../firebase/Database/Functions/dbNews";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import News from "../Components/Custom/News";
import { AuthContext } from "../Components/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StarButton from "../Components/Buttons/StarButton";
import { withNavigation } from "react-navigation";
import AddNewsForm from "../Components/Forms/AddNewsForm";
import PetButton from "../Components/Buttons/PetButton";

class VetScreen extends React.Component {
  static contextType = AuthContext;
  state = { mounted: false,
            showNewsForm: false };

  componentDidMount() {
    const place = this.props.navigation.state.params.place;
    this.setState({ mounted: true });

    if (place.getType() === "Kennel") {
      dbAdoptableAnimal
        .getAdoptableAnimals(place.id)
        .then((adoptableAnimals) => {
          if (adoptableAnimals.length!=0){
          let promises = adoptableAnimals.map((animalID) => {
            return dbAdoptableAnimal
              .getAdoptableAnimals(place.id, animalID)
              .then((animal) => {
                return animal;
              });
          });
          Promise.all(promises).then((animals) => {
            this.setState({ animalsToAdopt: animals });
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  openInMap = () => {
    this.props.navigation.push("Map", {
      currentPlace: this.props.navigation.state.params.place,
    });
  };

  addNews = () => {
    if (this.state.mounted) {
      this.setState({ showNewsForm: true });
    }
  };

  isKennel = (place) => {
    return place.getType() === "Kennel";
  };

  addAnimalToAdopt = () => {
    console.log("Add animal to adopt");
    //TODO
  };

  deletePet = (petID) => {
      const pid = this.props.navigation.state.params.place.id;
      dbAdoptableAnimal.deleteAdoptableAnimal(pid, petID);
      let petsUpdated = this.state.animalsToAdopt;
      let index = petsUpdated.indexOf(petID);
      if (index != -1) {
        petsUpdated.splice(index, 1);
      }
      console.log(petsUpdated);
      if (this.state.mounted) {
        this.setState({ animalsToAdopt: petsUpdated });
      }
  };

  render() {
    const place = this.props.navigation.state.params.place;
    const pid = place.id;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AddNewsForm
          pid={pid}
          visible={this.state.showNewsForm}
          close={() => {
            this.setState({ showNewsForm: false });
          }}
        ></AddNewsForm>
        <View>
          <ImageBackground
            source={{ uri: place.photo }}
            style={styles.vetImage}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: "white",
                    textShadowColor: "black",
                    textShadowRadius: 2,
                  },
                ]}
              >
                {place.getName()}
              </Text>

              <LinearGradient
                style={styles.buttons}
                // Background Linear Gradient
                colors={[
                  "rgba(255,255,255, 0.8)",
                  "rgba(255,255,255,0.95)",
                  "rgba(255,255,255,1)",
                ]}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.openInMap.bind(this)}
                >
                  <Text style={styles.buttonText}>Open in map </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.addNews()}
                >
                  <Text style={styles.buttonText}> + News </Text>
                </TouchableOpacity>
                {this.isKennel(place) ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.addAnimalToAdopt()}
                  >
                    <Text style={styles.buttonText}> + Animals </Text>
                  </TouchableOpacity>
                ) : null}

                <StarButton uid={this.context.uid} pid={pid} />
              </LinearGradient>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.details}>
          <Text>
            {place.getAddress()}
            {"\n"}
            {place.getDescription()}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: 10 }}
          >
            <News placeId={pid}></News>
          </ScrollView>
        </View>
        {this.state.animalsToAdopt != null ? (
                <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  justifyContent: "center",
                                }}
                              >
                                <PetButton
                                  navigation={this.props.navigation}
                                  pets={this.state.animalsToAdopt}
                                  isAdoptable = {true}
                                  pid = {this.props.navigation.state.params.place.id}
                                  deleteAnimal={this.deletePet}
                                ></PetButton>
                              </View>
                ) : null}


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
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white",
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
    margin: 10,
  },
  buttons: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    //backgroundColor: "#F9844A",
    //height: 44,
    //borderRadius: 22,

    padding: 10,
    marginLeft: 10,
    borderBottomColor: "orange",
    borderBottomWidth: 2,
  },

  buttonText: {
    color: "orange",
    alignSelf: "center",
    fontWeight: "bold",
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 10,
  },
  details: {
    paddingTop: 15,
    paddingHorizontal: 25,
    color: "black",
    //backgroundColor: "rgba(255,255,255,0.6)",
  },
  vetImage: {
    width: "100%",
    height: 200,
    borderRadius: 75,
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
export default withNavigation(VetScreen);