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
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import dbPlace from "../firebase/Database/Functions/dbPlace";
import News from "../Components/Custom/News";
import { AuthContext } from "../Components/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import StarButton from "../Components/Buttons/StarButton";
import { withNavigation } from "react-navigation";
import AddNewsForm from "../Components/Forms/AddNewsForm";
import AddPetForm from "../Components/Forms/AddPetForm";
import PetButton from "../Components/Buttons/PetButton";
import storageManager from "../firebase/Storage/storage";
import PhotoBox from "../Components/Custom/PhotoBox";

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

    console.log("COMPONENT DID MOUNT PLACE");

    if (
          this.context.user.type == "business" &&
          this.context.places.includes(place.id)
        ) {
          isEditable = true;
        }

    if (place.isKennel()) {
       isKennel = true;
       if(isEditable){
         this.getAdoptablePets(this.context.adoptablePets[place.id]); //your kennel, ids are in context
       }
       else{
         this.getAdoptablePetsFromDb(); //not your kennel , ids must be retrieved in db
       }
    }

    const photo = place.photo;

    this.setState({ mounted : true , photo: photo , isKennel: isKennel , isEditable: isEditable });
    this.setState({pets:[]});
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  componentDidUpdate(prevProps,prevState){

    const placeID = this.props.navigation.state.params.place.id;

    if (this.state.isKennel && this.state.isEditable){
     if(this.state.pets.length != this.context.adoptablePets[placeID].length) {
          console.log("COMPONENT DID UPDATE FOR ADOPTABLE PETS");
          console.log("PETS: " + this.context.adoptablePets[placeID]);
          this.getAdoptablePets(this.context.adoptablePets[placeID]);
     }
    }

  }

  getAdoptablePets(petIDs){
    console.log("GET ADOPTABLE PETS");
    const placeID = this.props.navigation.state.params.place.id;

    if(petIDs.length != 0){
    let promises = petIDs.map((petID) => {
             return dbAdoptableAnimal.getAdoptableAnimal(placeID,petID).then((pet) => {
               pet.id = petID;
               return pet;
             });
           });
            Promise.all(promises).then((pets) => {
                this.setState({pets:pets});
    });
    }
    else{
     this.setState({pets:petIDs});
    }
  }

  getAdoptablePetsFromDb(){
    const placeID = this.props.navigation.state.params.place.id;
    dbAdoptableAnimal.getAdoptableAnimals(placeID).then((animals) => {
       if (animals!= null){
       let promises = animals.map((petID) => {
                    return dbAdoptableAnimal.getAdoptableAnimal(placeID,petID).then((pet) => {
                      pet.id = petID;
                      return pet;
                    });
                  });
                   Promise.all(promises).then((pets) => {
                       this.setState({pets:pets});
      });
      }
    });
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
    this.context.deleteAdoptablePet(pid,petID);
  };

  setPhoto = (photo) => {
    console.log("SET PHOTO");
    this.setState({ photo: photo });
  };

  render() {
    const place = this.props.navigation.state.params.place;
    const pid = place.id;
    const isEditable = this.state.isEditable;
    const photo = this.state.photo;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AddNewsForm
          pid={pid}
          visible={this.state.showNewsForm}
          close={() => {
            this.setState({ showNewsForm: false });
          }}
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
          photo={photo}
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

                {isEditable ? (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.addNews()}
                    >
                      <Text style={styles.buttonText}> + News </Text>
                    </TouchableOpacity>
                    {place.isKennel() ? (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setState({ showPetForm: true })}
                      >
                        <Text style={styles.buttonText}> + Animals </Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}

                {!isEditable ? (
                  <StarButton uid={this.context.uid} pid={pid} />
                ) : null}

                {isEditable ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.setState({ showPhotoBox: true })}
                  >
                    <Text style={styles.buttonText}> UpdatePhoto </Text>
                  </TouchableOpacity>
                ) : null}
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

        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ paddingTop: 10 }}
          >
            <News placeId={pid}></News>
          </ScrollView>

          {console.log("adoptable animals")}
          {console.log(this.state.pets)}
          <Text style={styles.title}>Adoptable pets</Text>
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

          {isEditable ? (
            <TouchableOpacity
              style={styles.button}
              onPress={this.deletePlaceHere}
            >
              <Text style={styles.buttonText}>Delete place</Text>
            </TouchableOpacity>
          ) : null}
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
