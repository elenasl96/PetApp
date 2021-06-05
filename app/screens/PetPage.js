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

import mainStyle from "../styles/mainStyle";
import storageManager from "../firebase/Storage/storage";
import { AuthContext } from "../Components/AuthContext";
import { withNavigation } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

//--- custom components -------
import PhotoBox from "../Components/Custom/PhotoBox";
import DiseasePanel from "../Components/Custom/DiseasePanel";
import Chart from "../Components/Custom/PetChart.js";
import ReportLossForm from "../Components/Forms/ReportLossForm";
//--------------------------

class PetScreen extends React.Component {
  state = {
    mounted: true,
    photo: null,
    showReportLossForm: false,
    showPhotoBox: false,
    errors: {},
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    const pet = this.props.navigation.state.params.pet;
    if (this.state.mounted) {
      this.setState({ photo: pet.photo });
    }
  }

  deletePet = () => {
    const petID = this.props.navigation.state.params.petID;
    storageManager.deleteFile(this.state.photo);
    this.props.navigation.state.params.deleteAnimal(petID);
    this.props.navigation.goBack();
  };

  reportLoss = () => {
    if (this.state.mounted) {
      this.setState({ showReportLossForm: true });
    }
  };

  setPhoto = (photo) => {
    if (this.state.mounted) {
      this.setState({ photo: photo });
    }
  };

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  sendForm = (lostPet, seen) => {
    const pet = this.props.navigation.state.params.pet;

    dbLostPet.getLostPetsMatched(lostPet).then((lostPetsMatched) => {
      if (lostPetsMatched.length > 0) {
        this.setState({
          showLostPets: false,
          showLostPetsSeen: false,
          showReportLossForm: false,
          showReportSightForm: false,
          lostPetsMatched: lostPetsMatched,
          showPetsMatched: !seen,
          showPetsMatchedSeen: seen,
        });
      } else {
        if (seen) {
          this.confirmReportSeen(lostPet);
        } else {
          this.confirmReport(lostPet);
        }

        this.setState({ showReportLossForm: false });
      }
    });
  };

  render() {
    const pet = this.props.navigation.state.params.pet;
    const petID = this.props.navigation.state.params.petID;
    const type = pet.type;
    const photo = this.state.photo;
    const isAdoptable = this.props.navigation.state.params.isAdoptable;
    const isEditable = this.props.navigation.state.params.isEditable;

    var section = "";
    var pid = null;

    if (isAdoptable) {
      section = "kennelpets";
      pid = this.props.navigation.state.params.pid;
    } else {
      section = "pets";
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ReportLossForm
          pet={pet}
          visible={this.state.showReportLossForm}
          close={() => {
            this.setState({ showReportLossForm: false });
          }}
          sendForm={this.sendForm}
        ></ReportLossForm>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {isEditable ? ( // if user pet isEditable is set to true by default
              <PhotoBox
                petID={petID}
                section={section}
                setPhoto={this.setPhoto}
                isUpdate={true}
                photo={photo}
                visible={this.state.showPhotoBox}
                close={() => {
                  this.setState({ showPhotoBox: false });
                }}
              ></PhotoBox>
            ) : null}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.petContainer}>
                <View style={styles.buttons}>
                  {isEditable ? (
                    <TouchableOpacity
                      style={[mainStyle.roundButton, { marginLeft: 60 }]}
                      onPress={this.deletePet}
                    >
                      <Text style={styles.buttonText}>
                        <AntDesign name="delete" size={24} color="red" />
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {!isAdoptable ? (
                    <TouchableOpacity
                      style={[mainStyle.roundButton, { marginLeft: 20 }]}
                      onPress={() => {
                        this.setState({ showReportLossForm: true });
                      }}
                    >
                      <Text style={styles.buttonText}>
                        <Feather name="alert-circle" size={24} color="orange" />
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {!isAdoptable ? (
                    <TouchableOpacity
                      style={[mainStyle.roundButton, { marginLeft: 60 }]}
                      onPress={() => {
                        this.setState({ showPhotoBox: true });
                      }}
                    >
                      <Text style={styles.buttonText}>
                        <Feather name="image" size={24} color="lightblue" />
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  <ImageBackground
                    source={{ uri: this.state.photo }}
                    style={styles.petImage}
                    imageStyle={{ borderRadius: 150 }}
                  ></ImageBackground>
                </View>
                <View style={styles.petName}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {pet.getName()}
                  </Text>
                  <Ionicons
                    style={{ textAlign: "center" }}
                    name="md-paw"
                    size={24}
                    color="#f94144"
                  />
                </View>
              </View>
              <View
                style={{
                  flexBasis: 500,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <View style={styles.info}>
                  <Text style={styles.infoTitle}>Age </Text>
                  <Text style={styles.infoText}>{pet.getAge()} </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoTitle}>Size </Text>
                  <Text style={styles.infoText}>{pet.getSize()} </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.infoTitle}>Breed </Text>
                  <Text style={styles.infoText}>{pet.getBreed()} </Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.infoTitle}>Color </Text>
                  <Text style={styles.infoText}>{pet.getColor()} </Text>
                </View>
              </View>
            </View>

            {isAdoptable ? (
              <View style={styles.profile}>
                <Text style={styles.title}>Profile</Text>
                <Text>{pet.profile}</Text>
              </View>
            ) : null}

            <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
              <DiseasePanel
                petID={petID}
                type={type}
                isAdoptable={isAdoptable}
                isEditable={isEditable}
                pid={pid}
              >
                {" "}
              </DiseasePanel>

              {!isAdoptable ? <Chart petID={petID}></Chart> : null}
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
  buttons: {
    flexDirection: "column",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 10,
    marginBottom: 10,
    marginLeft: 10,
    elevation: 2,
    alignSelf: "center",
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
    justifyContent: "center",
    alignContent: "center",
    //paddingBottom: 20,
  },
  pet: {
    width: 150,
    height: 150,
    //borderRadius: 150,
    //backgroundColor: "white",
    marginLeft: 10,
    elevation: 2,
  },
  petImage: {
    width: 150,
    height: 150,
    //borderRadius: 0,
    //resizeMode: "cover",
    padding: 10,
    elevation: 2,
  },
  info: {
    //backgroundColor: "#F9C74F",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 7,
    marginRight: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    elevation: 2,
  },
  infoText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  infoTitle: {
    color: "#f94144",
    fontWeight: "bold",
    textAlign: "center",
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
  title: {
    color: "#4cc9f0",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
  petName: {
    alignSelf: "center",
    margin: 15,
  },
  profile: {
    paddingHorizontal: 20,
  },
});
export default withNavigation(PetScreen);
