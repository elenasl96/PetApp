import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  TextInput,
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
import mainStyle from "../styles/mainStyle";
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import storageManager from "../firebase/Storage/storage";
import { AuthContext } from "../Components/AuthContext";
import { withNavigation } from "react-navigation";
import { Picker } from "@react-native-picker/picker";
import ImagePickerExample from "../Components/Custom/camera";

import Chart from "../Components/Custom/PetChart.js";
import utils from "../shared/utilities";
import constants from "../shared/constants";
import ReportLossForm from "../Components/Forms/ReportLossForm";

class PetScreen extends React.Component {
  state = {
    diseases: {},
    diseaseShown: null,
    diseaseSelected: null,
    mounted: true,
    photoUpload: null,
    photo: null,
    errors: {}, // dict
    showReportLossForm: false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    const DIDs = this.props.navigation.state.params.DIDs;
    DIDs.map((did) => {
      dbUserAnimal
        .getAnimalDisease(
          this.context.uid,
          this.props.navigation.state.params.petID,
          did
        )
        .then((disease) => {
          if (this.state.diseaseShown == null) {
            this.setState({ diseaseShown: disease.name });
          }
          dbUserAnimal
            .getDiseaseDescription(disease.name)
            .then((descriptions) => {
              this.state.diseases[disease.name] = descriptions[0];
              this.setState({ mounted: true });
            });
        });
    });

    const pet = this.props.navigation.state.params.pet;

    if (pet.type == "Dog") {
      this.setState({ diseaseSelected: constants.DISEASES_DOG[0] });
    } else {
      this.setState({ diseaseSelected: constants.DISEASES_CAT[0] });
    }

    this.setState({ photo: pet.photo });
  }

  deletePet = () => {
    console.log("url: " + this.state.photo);
    storageManager.deleteFile(this.state.photo);
    dbUserAnimal.deleteAnimal(
      this.context.uid,
      this.props.navigation.state.params.petID
    );
  };

  setPhoto = (photo) => {
    let errors = {};
    this.setState({ photoUpload: photo });
    this.setState({ errors: errors }); //clean errors
  };

  updatePhoto = async () => {
    let errors = {};
    const petID = this.props.navigation.state.params.petID;
    const uid = this.context.uid;
    const photoUpload = this.state.photoUpload;
    const photo = this.state.photo;

    if (photoUpload != null) {
      console.log("Url deleted: " + photo);
      storageManager.deleteFile(photo); // deletes old photo from storage
      const response = await fetch(photoUpload);
      const file = await response.blob();

      storageManager.toStorage(uid, file, "pets").then((url) => {
        // add new photo in storage
        dbUserAnimal.updatePetPhoto(uid, petID, url); // update ref in db
        console.log("New url: " + url);
        this.setState({ photo: url }); // update local photo
      });
    } else {
      errors["photo"] = "You must load a photo";
    }

    this.setState({ errors: errors });
  };

  reportLoss = () => {
    this.setState({ showReportLossForm: true });
  };

  addDisease = () => {
    var disease = this.state.diseaseSelected;
    var diseases = Object.keys(this.state.diseases);
    let errors = {};

    if (diseases.includes(disease)) {
      errors["addDisease"] = "Disease already present!";
      console.log(errors["addDisease"]);
    } else {
      dbUserAnimal.addAnimalDisease(
        this.context.uid,
        this.props.navigation.state.params.petID,
        disease
      );

      if (this.state.diseaseShown == null) {
        this.setState({ diseaseShown: disease });
      }

      dbUserAnimal.getDiseaseDescription(disease).then((descriptions) => {
        this.state.diseases[disease] = descriptions[0];
        this.setState({ mounted: true });
      });
    }

    this.setState({ errors: errors });
    this.setState({ mounted: true });
  };

  deleteDisease = () => {
    var disease = this.state.diseaseShown;
    let errors = {};
    dbUserAnimal.deleteAnimalDiseaseByName(
      this.context.uid,
      this.props.navigation.state.params.petID,
      disease
    );
    delete this.state.diseases[disease];
    this.setState({ errors: errors }); // clean errors
    var diseases = Object.keys(this.state.diseases);
    if (diseases.length != 0) {
      this.setState({ diseaseShown: diseases[0] });
      this.setState({ descriptionShown: this.state.diseases[diseases[0]] });
    } else {
      this.setState({ diseaseShown: null });
      this.setState({ descriptionShown: null });
    }
  };

  render() {
    const pet = this.props.navigation.state.params.pet;
    const WIDs = this.props.navigation.state.params.WIDs;
    const HIDs = this.props.navigation.state.params.HIDs;
    const petID = this.props.navigation.state.params.petID;

    const descriptionShown = this.state.diseases[this.state.diseaseShown];
    const temp = Object.keys(this.state.diseases);
    let diseases = temp.map((s) => {
      //console.log("s: "+ s);
      return (
        <TouchableHighlight
          style={styles.info}
          value={s}
          key={s}
          onPress={() => this.setState({ diseaseShown: s })}
        >
          <View style={styles.info}>
            <Text>{s}</Text>
          </View>
        </TouchableHighlight>
      );
    });

    var diseasesSelectable = [];

    if (pet.type == "Dog") {
      diseasesSelectable = constants.DISEASES_DOG.map((s, i) => {
        return <Picker.Item key={i} value={s} label={s} />;
      });
    } else {
      diseasesSelectable = constants.DISEASES_CAT.map((s, i) => {
        return <Picker.Item key={i} value={s} label={s} />;
      });
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ReportLossForm
          pet={pet}
          visible={this.state.showReportLossForm}
          close={() => {
            this.setState({ showReportLossForm: false });
          }}
        ></ReportLossForm>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.petContainer}>
              <View style={styles.pet}>
                <ImageBackground
                  source={{ uri: this.state.photo }}
                  style={styles.petImage}
                  imageStyle={{ borderRadius: 50 }}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: "white",
                        textShadowColor: "black",
                        textShadowRadius: 2,
                        alignSelf: "center",
                      },
                    ]}
                  >
                    {pet.name}
                  </Text>
                </ImageBackground>
              </View>

              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.deletePet}
                >
                  <Text style={styles.buttonText}>Delete pet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.reportLoss}
                >
                  <Text style={styles.buttonText}>Report loss</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ImagePickerExample setPhoto={this.setPhoto}></ImagePickerExample>

            {this.state.errors["photo"] != null ? (
              <Text style={styles.error}>{this.state.errors["photo"]}</Text>
            ) : null}

            <TouchableHighlight
              style={styles.petButton}
              onPress={this.updatePhoto.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <View style>
                <Text>Update photo</Text>
              </View>
            </TouchableHighlight>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Size</Text>
                  <Text>{pet.size}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Breed</Text>
                  <Text>{pet.breed}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Color</Text>
                  <Text>{pet.color}</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>

            <TouchableHighlight>
              <View style={styles.info}>
                <Text>Diseases</Text>
              </View>
            </TouchableHighlight>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {diseases}
            </ScrollView>

            {temp.length != 0 ? (
              <View style={styles.info}>
                <Text>{descriptionShown}</Text>
              </View>
            ) : null}

            <View style={styles.info}>
              <Text>AddDiseases</Text>
            </View>

            <View style={mainStyle.form}>
              <Picker
                selectedValue={this.state.diseaseSelected}
                style={{ height: 50, width: "100%" }}
                onValueChange={(disease) =>
                  this.setState({ diseaseSelected: disease })
                }
              >
                {diseasesSelectable}
              </Picker>
            </View>

            <TouchableHighlight
              style={styles.petButton}
              onPress={this.addDisease.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <Text style={{ textAlign: "center" }}>add</Text>
            </TouchableHighlight>

            {this.state.errors["addDisease"] != null ? (
              <Text style={styles.error}>
                {this.state.errors["addDisease"]}
              </Text>
            ) : null}

            {temp.length != 0 ? (
              <TouchableHighlight
                style={styles.petButton}
                onPress={this.deleteDisease.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>delete</Text>
              </TouchableHighlight>
            ) : null}

            <Chart WIDs={WIDs} HIDs={HIDs} petID={petID} pet={pet}></Chart>
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
  buttons: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  petButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
    elevation: 2,
    marginHorizontal: 5,
    width: 70,
    height: 30,
  },
  button: {
    backgroundColor: "#F9844A",
    minWidth: 100,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 5,
    marginLeft: 10,
    alignContent: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  petContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
  },
  pet: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "white",
    marginLeft: 10,
  },
  petImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
    padding: 10,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F9C74F",
    borderRadius: 20,
    marginLeft: 7,
    marginRight: 5,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },

  descriptionContainer: {
    padding: 10,
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
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
});
export default withNavigation(PetScreen);
