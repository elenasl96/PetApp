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

import Chart from "./PetChart.js";
import utils from "../Components/utilities";

class PetScreen extends React.Component {
  state = {
    dataWeight: [],
    labelsWeight: [],
    dataHeight: [],
    labelsHeight: [],
    diseases: "",
    data: [],
    labels: [],
    newdata: null,
    newlabel: null,
    newtype: null,
    mounted: true,
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
        this.state.labelsWeight.push(sample.label);
        this.state.data.push(sample.value);
        this.state.labels.push(sample.label);
        //console.log("weight label: "+ sample.label);
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
        this.state.labelsHeight.push(sample.label);
        this.setState({ mounted: true });
      });
    });

    const DIDs = this.props.navigation.state.params.DIDs;
    //console.log("DIDs in mount: "+  DIDs);
    DIDs.map((did) => {
      db.getAnimalDisease(
        this.context.uid,
        this.props.navigation.state.params.petID,
        did
      ).then((disease) => {
        //console.log("Disease retrieved: "+ disease.name);

        if (this.state.diseases != "") {
          this.state.diseases = this.state.diseases + ",";
        }
        this.state.diseases = this.state.diseases + disease.name;
        this.setState({ mounted: true });
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

  addPetStatSample = () => {
    console.log("addPetStatSample");
    if (!this.state.labels.includes(utils.timestamp())) {
      if (this.state.newtype == "weight") {
        this.state.dataWeight.push(Number(this.state.newdata));
        //this.state.data.push(Number(this.state.newdata));
        this.state.labelsWeight.push(utils.timestamp());
        //this.state.labels.push(timestamp);
        this.showWeight();
      }

      if (this.state.newtype == "height") {
        this.state.dataHeight.push(Number(this.state.newdata));
        //this.state.data.push(Number(this.state.newdata));
        this.state.labelsHeight.push(utils.timestamp());
        //this.state.labels.push(timestamp);
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
    } else {
      console.log("Sample already added today");
    }

    this.setState({ mounted: true });
  };

  showWeight = () => {
    //console.log("Weight");
    this.state.data = this.state.dataWeight;
    this.state.labels = this.state.labelsWeight;
    //console.log("samples: "+ this.state.data);
    //console.log("labels: " + this.state.labels);
    this.setState({ mounted: true });
    this.setState({ newtype: "weight" });
  };

  showHeight = () => {
    //console.log("Height");
    this.state.data = this.state.dataHeight;
    this.state.labels = this.state.labelsHeight;
    //console.log("samples: "+ this.state.data);
    //console.log("labels: " + this.state.labels);
    this.setState({ newtype: "height" });
  };

  render() {
    const pet = this.props.navigation.state.params.pet;
    const data = this.state.data;
    const labels = this.state.labels;
    const diseases = this.state.diseases;

    //console.log("Weight samples : "+ this.state.data);
    //console.log("Weight labels : "+ this.state.labels);
    //console.log("Diseases : "+ diseases);

    //this.state.data = [30,40,50,60];
    //this.state.labels = ['09/03/2021','10/03/2021','11/03/2021','12/03/2021'];
    //const data = [30,40,50,60];
    //const labels = ['09/03/2021','10/03/2021','11/03/2021','12/03/2021'];

    if (this.state.data.length != 0) {
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
                    <Text>Diseases</Text>

                    <Text>{diseases}</Text>
                  </View>
                </TouchableHighlight>
              </ScrollView>

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

              <Chart labels={labels} data={data} />

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
    } else {
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
                    <Text>Diseases</Text>

                    <Text>{diseases}</Text>
                  </View>
                </TouchableHighlight>
              </ScrollView>

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
