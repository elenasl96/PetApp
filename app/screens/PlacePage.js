import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import dbAdoptableAnimal from "../firebase/database/functions/DbAdoptableAnimal";
import News from "../components/custom/News";
import { AuthContext } from "../components/custom/ContextProvider";
import { LinearGradient } from "expo-linear-gradient";
import StarButton from "../components/buttons/StarButton";
import { withNavigation } from "react-navigation";
import AddNewsForm from "../components/forms/AddNewsForm";
import AddPetForm from "../components/forms/AddPetForm";
import PetButton from "../components/buttons/PetButton";
import storageManager from "../firebase/storage/Storage";
import PhotoBox from "../components/custom/PhotoBox";
import mainStyle from "../styles/MainStyle";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import EditableText from "../components/custom/EditableText";

class VetScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    mounted: false,
    showNewsForm: false,
    showPetForm: false,
    showPhotoBox: false,
    pets: [],
    isEditable: false,
    photo: null,
    isKennel: false,
  };

  componentDidMount() {
    const place = this.props.navigation.state.params.place;
    var isKennel = false;
    var isEditable = false;

    if (
      this.context.user.type == "business" &&
      this.context.places.includes(place.id)
    ) {
      isEditable = true;
    }

    if (place.isKennel()) {
      isKennel = true;
      if (isEditable) {
        this.getAdoptablePets(this.context.adoptablePets[place.id]); //your kennel, ids are in context
      } else {
        this.getAdoptablePetsFromDb(); //not your kennel , ids must be retrieved in db
      }
    }

    const photo = place.photo;

    this.setState({
      mounted: true,
      photo: photo,
      isKennel: isKennel,
      isEditable: isEditable,
    });
    this.setState({ pets: [] });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  componentDidUpdate(prevProps, prevState) {
    const placeID = this.props.navigation.state.params.place.id;

    if (this.state.isKennel && this.state.isEditable) {
      if (
        this.state.pets.length != this.context.adoptablePets[placeID].length
      ) {
        this.getAdoptablePets(this.context.adoptablePets[placeID]);
      }
    }
  }

  getAdoptablePets(petIDs) {
    const placeID = this.props.navigation.state.params.place.id;

    if (petIDs.length != 0) {
      let promises = petIDs.map((petID) => {
        return dbAdoptableAnimal
          .getAdoptableAnimal(placeID, petID)
          .then((pet) => {
            pet.id = petID;
            return pet;
          });
      });
      Promise.all(promises).then((pets) => {
        this.setState({ pets: pets });
      });
    } else {
      this.setState({ pets: petIDs });
    }
  }

  getAdoptablePetsFromDb() {
    const placeID = this.props.navigation.state.params.place.id;
    dbAdoptableAnimal.getAdoptableAnimals(placeID).then((animals) => {
      if (animals != null) {
        let promises = animals.map((petID) => {
          return dbAdoptableAnimal
            .getAdoptableAnimal(placeID, petID)
            .then((pet) => {
              pet.id = petID;
              return pet;
            });
        });
        Promise.all(promises).then((pets) => {
          this.setState({ pets: pets });
        });
      }
    });
  }

  openInMap = () => {
    this.props.navigation.navigate("MapHome", {
      currentPlace: this.props.navigation.state.params.place,
    });
  };

  addNews = () => {
    if (this.state.mounted) {
      this.setState({ showNewsForm: true });
    }
  };

  updateNews = (doc) => {
    this.state.news.addNews(doc);
  };

  deletePlaceHere = () => {
    const placeID = this.props.navigation.state.params.place.id;
    const photo = this.props.navigation.state.params.place.photo;
    storageManager.deleteFile(photo);
    this.props.navigation.state.params.deletePlace(placeID);
    this.props.navigation.goBack();
  };

  deletePet = (petID) => {
    const pid = this.props.navigation.state.params.place.id;
    dbAdoptableAnimal.deleteAdoptableAnimal(pid, petID);
    this.context.deleteAdoptablePet(pid, petID);
  };

  setPhoto = (photo) => {
    this.setState({ photo: photo });
  };

  render() {
    const place = this.props.navigation.state.params.place;
    const pid = place.id;
    const isEditable = this.state.isEditable;
    const photo = this.state.photo;

    /* <Text>
              {place.getAddress()}
              {"\n"}
              {place.getDescription()}
            </Text>  */

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <AddNewsForm
            pid={pid}
            visible={this.state.showNewsForm}
            close={() => {
              this.setState({ showNewsForm: false });
            }}
            updateNews={this.updateNews}
          ></AddNewsForm>
          <AddPetForm
            adoptable={true}
            pid={pid}
            visible={this.state.showPetForm}
            close={() => {
              this.setState({ showPetForm: false });
            }}
            addPet={this.addAnimalToAdopt}
          ></AddPetForm>

          <PhotoBox
            pid={pid}
            section={"places"}
            setPhoto={this.setPhoto}
            isUpdate={true}
            photo={place.photo}
            visible={this.state.showPhotoBox}
            close={() => {
              this.setState({ showPhotoBox: false });
            }}
          ></PhotoBox>

          <View>
            <ImageBackground source={{ uri: photo }} style={styles.vetImage}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color: "white",
                      textShadowColor: "black",
                      textShadowRadius: 5,
                      textAlign: "center",
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
                    style={mainStyle.roundButton}
                    onPress={this.openInMap.bind(this)}
                  >
                    <Feather name="map" size={24} color="lightgreen" />
                  </TouchableOpacity>

                  {isEditable ? (
                    <>
                      <TouchableOpacity
                        style={mainStyle.roundButton}
                        onPress={() => this.addNews()}
                      >
                        <FontAwesome
                          name="newspaper-o"
                          size={24}
                          color="powderblue"
                        />
                      </TouchableOpacity>
                      {place.isKennel() ? (
                        <TouchableOpacity
                          style={mainStyle.roundButton}
                          onPress={() => this.setState({ showPetForm: true })}
                        >
                          <FontAwesome name="paw" size={24} color="orange" />
                        </TouchableOpacity>
                      ) : null}
                    </>
                  ) : null}

                  {!isEditable ? (
                    <StarButton uid={this.context.uid} pid={pid} />
                  ) : null}

                  {isEditable ? (
                    <TouchableOpacity
                      style={mainStyle.roundButton}
                      onPress={() => this.setState({ showPhotoBox: true })}
                    >
                      <FontAwesome name="image" size={24} color="orange" />
                    </TouchableOpacity>
                  ) : null}

                  {isEditable ? (
                    <TouchableOpacity
                      style={mainStyle.roundButton}
                      onPress={this.deletePlaceHere}
                    >
                      <AntDesign name="delete" size={24} color="red" />
                    </TouchableOpacity>
                  ) : null}
                </LinearGradient>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.details}>
            {!isEditable ? (
              <Text>
                {place.getAddress()}
                {"\n"}
                {place.getDescription()}
              </Text>
            ) : (
              <>
                <EditableText
                  text={place.getAddress()}
                  field="address"
                  pid={pid}
                ></EditableText>
                <EditableText
                  text={place.getDescription()}
                  field="description"
                  pid={pid}
                >
                  {" "}
                </EditableText>
              </>
            )}

            {this.state.pets.length > 0 ? (
              <Text style={styles.title2}>Pets for adoption</Text>
            ) : null}

            {this.state.pets.length > 0 ? (
              <View style={styles.mainContent}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <PetButton
                    navigation={this.props.navigation}
                    pets={this.state.pets}
                    isAdoptable={true}
                    isEditable={isEditable}
                    pid={this.props.navigation.state.params.place.id}
                    deleteAnimal={this.deletePet}
                  ></PetButton>
                </ScrollView>
              </View>
            ) : null}
            <Text style={styles.title2}>News</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingTop: 10,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <News
                  ref={(news) => (this.state.news = news)}
                  placeId={pid}
                  isEditable={isEditable}
                ></News>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
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
    fontFamily: "Roboto",
    margin: 10,
  },
  buttons: {
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  button: {
    padding: 10,
    marginLeft: 10,
    borderBottomColor: "orange",
    borderBottomWidth: 2,
  },

  buttonText: {
    color: "orange",
    alignSelf: "center",
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  title2: {
    color: "#4cc9f0",
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 20,
    marginVertical: 15,
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 20,
    margin: 10,
  },
  details: {
    paddingTop: 15,
    paddingHorizontal: 25,
    color: "black",
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
