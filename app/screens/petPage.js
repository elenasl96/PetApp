import React,{useState} from "react";

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
import mainStyle from "../styles/mainStyle";
import db from "../firebase/DatabaseManager";
import { AuthContext } from "../Components/AuthContext";
import { withNavigation } from "react-navigation";

import Chart from "./PetChart.js";

class PetScreen extends React.Component {

  state = {
          user: {},
          dataWeight:  [],
          labelsWeight: [],
          dataHeight: [],
          labelsHeight: [],
          diseases: [],
  }

  //state = { user: {} };

  static contextType = AuthContext;

  componentDidMount(){

    const WIDs = this.props.navigation.state.params.WIDs;
    WIDs.map((wid) => {
      db.getAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,"weight",wid).then((sample) => {
         this.state.dataWeight.push(sample.value);
         this.state.dataHeight.push(sample.label);
      });
    });

    const HIDs = this.props.navigation.state.params.HIDs;
    HIDs.map((hid) => {
      db.getAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,"height",hid).then((sample) => {
                this.state.dataWeight.push(sample.value);
                this.state.dataHeight.push(sample.label);
             });
    });

    const DIDs = this.props.navigation.state.params.DIDs;
    console.log("DIDs in mount: "+  DIDs);
    DIDs.map((did) => {
      db.getAnimalDisease(this.context.uid,this.props.navigation.state.params.petID,did).then((disease) => {
                      this.state.diseases.push(disease.name);
                   });
    });

    }

  deletePet = () => {
    db.deleteAnimal(this.context.uid, this.props.navigation.state.params.petID);
  };

  reportLoss = () => {
    this.props.navigation.navigate("ReportLoss", {
      pet: this.props.navigation.state.params.pet,
    });
  };

  addPetStat = () => {};

  render() {

    const pet = this.props.navigation.state.params.pet;
    const dataWeight = this.state.dataWeight;
    const labelsWeight = this.state.labelsWeight;
    const dataHeight = this.state.dataHeight;
    const labelsHeight = this.state.labelsHeight;
    const diseases = this.state.diseases;

    console.log("Weight samples : "+ dataWeight);
    console.log("Height samples : "+ dataHeight);
    console.log("Diseases : "+ diseases);


    /*
    this.state.data = [30,40,50,60];
    this.state.labels = ['09/03/2021','10/03/2021','11/03/2021','12/03/2021'];
    const data = this.state.data;
    const labels = this.state.labels; */


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.petContainer}>
              <View style={styles.pet}>
                <ImageBackground
                  source={require("../../assets/images/Gioia.jpg")}
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

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Disease</Text>
                  <Text>{pet.diseases}</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>

            <TouchableHighlight
                        style={styles.petButton}
                        //onPress={this.showAllMarkers.bind(this)}
                        underlayColor={"rgb(200,200,200)"}
                      >
                        <Text style={{ textAlign: "center" }}>weight</Text>
                      </TouchableHighlight>

            <TouchableHighlight
                        style={styles.petButton}
                        //onPress={this.showAllMarkers.bind(this)}
                        underlayColor={"rgb(200,200,200)"}
                      >
                        <Text style={{ textAlign: "center" }}>height</Text>
                      </TouchableHighlight>

            <Chart labels = {labelsWeight} data = {dataWeight} />

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
});
export default withNavigation(PetScreen);
