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
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import storageManager from "../firebase/Storage/storage";
import { AuthContext } from "../Components/AuthContext";
import { withNavigation } from "react-navigation";

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
    errors: {},
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({mounted:true});
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
    /*if(isAdoptable){
      const pid = this.props.navigation.state.params.pid;
      dbAdoptableAnimal.deleteAnimal(
            pid,
            petID
      );
    }
    else{
        dbUserAnimal.deleteAdoptableAnimal(
          this.context.uid,
          petID
        );
    }
  */
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


    componentWillUnmount(){
      this.setState({mounted:false});
    }


  render() {
    const pet = this.props.navigation.state.params.pet;
    const petID = this.props.navigation.state.params.petID;
    const type = pet.type;
    const photo = this.state.photo;
    const isAdoptable = this.props.navigation.state.params.isAdoptable;

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

            <PhotoBox
              petID={petID}
              section={section}
              setPhoto={this.setPhoto}
              isUpdate={true}
              photo={photo}
            ></PhotoBox>

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

            <DiseasePanel
              petID={petID}
              type={type}
              isAdoptable={isAdoptable}
              pid={pid}
            >
              {" "}
            </DiseasePanel>

            {!isAdoptable ? (
              <Chart petID={petID}></Chart>
            ) : (
              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Profile</Text>
                  <Text>{pet.profile}</Text>
                </View>
              </TouchableHighlight>
            )}
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
