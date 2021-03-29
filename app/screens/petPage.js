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
import db from "../firebase/DatabaseManager";
import { AuthContext } from "../Components/AuthContext";
import { withNavigation } from "react-navigation";
import { Picker } from "@react-native-picker/picker";

import Chart from "./PetChart.js";
import utils from "../shared/utilities";
import constants from "../shared/constants";

class PetScreen extends React.Component {
  state = {
    dataWeight: [],
    dataHeight: [],
    data: [],
    newdata: "",
    diseases: {},
    diseaseShown: null,
    diseaseSelected: null,
    newtype: null,
    mounted: true,
    deletesample: "",
    errors: {}, // dict
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ newtype: "weight" });

    const WIDs = this.props.navigation.state.params.WIDs;
    WIDs.map((wid) => {
      db.getAnimalStatSample(
        this.context.uid,
        this.props.navigation.state.params.petID,
        "weight",
        wid
      ).then((sample) => {
        this.state.dataWeight.push(sample.value);
        this.state.data.push(sample.value);
        this.setState({ mounted: true });
      });
    });

    const HIDs = this.props.navigation.state.params.HIDs;
    HIDs.map((hid) => {
      db.getAnimalStatSample(
        this.context.uid,
        this.props.navigation.state.params.petID,
        "height",
        hid
      ).then((sample) => {
        this.state.dataHeight.push(sample.value);
        this.setState({ mounted: true });
      });
    });

    const DIDs = this.props.navigation.state.params.DIDs;
    DIDs.map((did) => {
      db.getAnimalDisease(
        this.context.uid,
        this.props.navigation.state.params.petID,
        did
      ).then((disease) => {
        if(this.state.diseaseShown==null){
          this.setState({diseaseShown:disease.name});
        }
        db.getDiseaseDescription(disease.name).then((descriptions) => {
          this.state.diseases[disease.name] = descriptions[0];
          this.setState({ mounted: true });
        });

      });
    });

    const pet = this.props.navigation.state.params.pet;

    if(pet.type == "Dog"){
          this.setState({diseaseSelected:constants.DISEASES_DOG[0]});
        }
        else{
          this.setState({diseaseSelected:constants.DISEASES_CAT[0]});
    }
  }

  handleValidation() {
      let formIsValid = true;
      let errors = {};
      errors["samples"] = null;

      if(this.state.newdata == ""){
        formIsValid = false;
        errors["samples"] = "Sample cannot be empty";
      }
      else {
      if (isNaN(this.state.newdata)) {
        formIsValid = false;
        errors["samples"] = "Sample must be a number";
      }

     }
      //console.log(errors);
      this.setState({ errors: errors });
      return formIsValid;
    }

  deletePet = () => {
    db.deleteAnimal(this.context.uid, this.props.navigation.state.params.petID);
  };

  reportLoss = () => {
    this.props.navigation.navigate("ReportLoss", {
      pet: this.props.navigation.state.params.pet,
    });
  };

  addPetStatSample = () => {
    if ( this.handleValidation()){
    //console.log("Valid sample");
    let errors = {};
    errors["samples"] = null;

      if (this.state.newtype == "weight") {
        this.state.dataWeight.push(Number(this.state.newdata));
        this.showWeight();
      }

      if (this.state.newtype == "height") {
        this.state.dataHeight.push(Number(this.state.newdata));
        this.showHeight();
      }
      db.addAnimalStatSample(
        this.context.uid,
        this.props.navigation.state.params.petID,
        this.state.newtype,
        Number(this.state.newdata)
      );
      console.log(
        "Added new sample with value: " +
          this.state.newdata +
          " and label: " +
          utils.timestamp()
      );

    this.setState({errors: errors});
    }
  };

  showWeight = () => {
    this.state.data = this.state.dataWeight;
    let errors = {};
    this.setState({errors: errors}); // clean errors
    this.setState({ newtype: "weight" });
  };

  showHeight = () => {
    this.state.data = this.state.dataHeight;
    let errors = {};
    this.setState({errors: errors}); // clean errors
    this.setState({ newtype: "height" });
  };

  addDisease = () => {

    db.addAnimalDisease(this.context.uid,this.props.navigation.state.params.petID,this.state.diseaseSelected);

    var disease = this.state.diseaseSelected;

    if(this.state.diseaseShown==null){
              this.setState({diseaseShown:disease});
    }

    db.getDiseaseDescription(this.state.diseaseSelected).then((descriptions) => {
              this.state.diseases[this.state.diseaseSelected] = descriptions[0];
    });

  };

  deleteStatSample = () => {

        let errors = {};
        errors["delete"] = null;


        if (this.state.newtype == "weight"){
           if (this.state.dataWeight.length == 0){
             errors["delete"] = "No samples for weight";
           }
           else{
             // Update component
             this.state.dataWeight.pop();
             this.showWeight();
             // Update db
             db.getAnimalStatSamples(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype).then((SIDs)=>{
                        let lastid = SIDs[SIDs.length - 1];
                        db.deleteAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype,lastid);
             });
           }
        }
        else{
          if (this.state.dataHeight.length == 0){
                       errors["delete"] = "No samples for height";
          }
          else{
            // Update component
            this.state.dataHeight.pop();
            this.showHeight();
            // Update db
            db.getAnimalStatSamples(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype).then((SIDs)=>{
               let lastid = SIDs[SIDs.length - 1];
               db.deleteAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype,lastid);
            });
          }
        }

        this.setState({ errors: errors });
        //db.deleteAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype,id);
  }

  render() {
    const pet = this.props.navigation.state.params.pet;
    const data = this.state.data;
    const descriptionShown = this.state.diseases[this.state.diseaseShown];
    const labels = [];
    const temp = Object.keys(this.state.diseases);
    let diseases = temp.map((s) => {
        console.log("s: "+ s);
        return ( <TouchableHighlight
                                      style={styles.info}
                                      value={s}
                                      key={s}
                                      onPress={() => this.setState({diseaseShown:s})}
                                    >
            <View style={styles.info}>
                   <Text>{s}</Text>
              </View>
          </TouchableHighlight>   );
    });


    var diseasesSelectable = [];

    if(pet.type == "Dog"){
    diseasesSelectable = constants.DISEASES_DOG.map((s, i) => {
          return <Picker.Item key={i} value={s} label={s} />;
        });

    }
    else{

      diseasesSelectable = constants.DISEASES_CAT.map((s, i) => {
                return <Picker.Item key={i} value={s} label={s} />;
              });
    }

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

            <View style={styles.info}>
               <Text>{descriptionShown}</Text>
            </View>

              <View style={styles.info}>
               <Text>AddDiseases</Text>
              </View>

              <View style={mainStyle.form}>
                        <Picker
                          selectedValue={this.state.diseaseSelected}
                          style={{ height: 50, width: "100%" }}
                          onValueChange={(disease) => this.setState({ diseaseSelected: disease })}
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

              <TouchableHighlight
                style={styles.petButton}
                onPress={this.showWeight.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>weight</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={styles.petButton}
                onPress={this.showHeight.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>height</Text>
              </TouchableHighlight>

             {this.state.data.length != 0 ? (<Chart labels={labels} data={data} /> ) : null }

              <Text style={styles.title}>Add new sample</Text>
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Value"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="name"
                  value={this.state.newdata}
                  onChangeText={(newdata) => this.setState({ newdata })}
                />
              </View>

              <TouchableHighlight
                style={styles.petButton}
                onPress={this.addPetStatSample.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>Save</Text>
              </TouchableHighlight>
              {this.state.errors["samples"] != null ? (
                        <Text style={styles.error}>{this.state.errors["samples"]}</Text>
                      ) : null}

              <TouchableHighlight
                              style={styles.petButton}
                              onPress={this.deleteStatSample.bind(this)}
                              underlayColor={"rgb(200,200,200)"}
                            >
                              <Text style={{ textAlign: "center" }}>Delete</Text>
                            </TouchableHighlight>

              {this.state.errors["delete"] != null ? (
                                      <Text style={styles.error}>{this.state.errors["delete"]}</Text>
                                    ) : null}

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