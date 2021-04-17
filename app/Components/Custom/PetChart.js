import React, { useState } from "react";
import { Text,
 View,
  StyleSheet,
  Dimensions,
  ScrollView,
   Button,
   TouchableHighlight,
     TextInput,} from 'react-native';
import dbUserAnimal from "../../firebase/Database/Functions/dbUserAnimal";
import utils from "../../shared/utilities";
import mainStyle from "../../styles/mainStyle";
import { AuthContext } from "../AuthContext";

import {
  LineChart
} from 'react-native-chart-kit';

class Chart extends React.Component {

  state = {
    labels : [],
    dataWeight: [],
    dataHeight: [],
    data: [],
    newtype: null,
    newdata: "",
    deletesample: "",
    errors: {}, // dict
    mounted: true,
  }

  static contextType = AuthContext;

  componentDidMount()  {

  this.setState({ newtype: "weight" });

      const petID = this.props.petID;

      dbUserAnimal.getAnimalStatSamples(this.context.uid, petID, "weight").then((WIDs) => {
      WIDs.map((wid) => {
        dbUserAnimal
          .getAnimalStatSample(
            this.context.uid,
            this.props.petID,
            "weight",
            wid
          )
          .then((sample) => {
            this.state.dataWeight.push(sample.value);
            this.state.data.push(sample.value);
            this.setState({ mounted: true });
          });
      });
     });

    dbUserAnimal.getAnimalStatSamples(this.context.uid, petID, "height").then((HIDs) => {
      HIDs.map((hid) => {
        dbUserAnimal
          .getAnimalStatSample(
            this.context.uid,
            this.props.petID,
            "height",
            hid
          )
          .then((sample) => {
            this.state.dataHeight.push(sample.value);
            this.setState({ mounted: true });
          });
      });
   });

  }

  handleValidation() {
      let formIsValid = true;
      let errors = {};
      errors["samples"] = null;

      if (this.state.newdata == "") {
        formIsValid = false;
        errors["samples"] = "Sample cannot be empty";
      } else {
        if (isNaN(this.state.newdata)) {
          formIsValid = false;
          errors["samples"] = "Sample must be a number";
        }
      }
      //console.log(errors);
      this.setState({ errors: errors });
      return formIsValid;
    }

    addPetStatSample = () => {
        if (this.handleValidation()) {
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
          dbUserAnimal.addAnimalStatSample(
            this.context.uid,
            this.props.petID,
            this.state.newtype,
            Number(this.state.newdata)
          );
          console.log(
            "Added new sample with value: " +
              this.state.newdata +
              " and label: " +
              utils.timestamp()
          );

          this.setState({ errors: errors });
        }
      };

      showWeight = () => {
        this.state.data = this.state.dataWeight;
        let errors = {};
        this.setState({ errors: errors }); // clean errors
        this.setState({ newtype: "weight" });
      };

      showHeight = () => {
        this.state.data = this.state.dataHeight;
        let errors = {};
        this.setState({ errors: errors }); // clean errors
        this.setState({ newtype: "height" });
      };

      deleteStatSample = () => {
          let errors = {};
          errors["delete"] = null;

          if (this.state.newtype == "weight") {
            if (this.state.dataWeight.length == 0) {
              errors["delete"] = "No samples for weight";
            } else {
              // Update component
              this.state.dataWeight.pop();
              this.showWeight();
              // Update db
              dbUserAnimal
                .getAnimalStatSamples(
                  this.context.uid,
                  this.props.petID,
                  this.state.newtype
                )
                .then((SIDs) => {
                  let lastid = SIDs[SIDs.length - 1];
                  dbUserAnimal.deleteAnimalStatSample(
                    this.context.uid,
                    this.props.petID,
                    this.state.newtype,
                    lastid
                  );
                });
            }
          } else {
            if (this.state.dataHeight.length == 0) {
              errors["delete"] = "No samples for height";
            } else {
              // Update component
              this.state.dataHeight.pop();
              this.showHeight();
              // Update db
              db.getAnimalStatSamples(
                this.context.uid,
                this.props.petID,
                this.state.newtype
              ).then((SIDs) => {
                let lastid = SIDs[SIDs.length - 1];
                dbUserAnimal.deleteAnimalStatSample(
                  this.context.uid,
                  this.props.petID,
                  this.state.newtype,
                  lastid
                );
              });
            }
          }

          this.setState({ errors: errors });
          //db.deleteAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype,id);
        };

  render() {

    const data = this.state.data;
    const labels = [];

    return (

    <>
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

    {data.length != 0 ? (
    <>
        <View style={styles.container}>
          <View>
            <LineChart
              data = {{
                labels : labels,
                datasets : [{ data : data, }],
              }}
              width={Dimensions.get('window').width - 16} // from react-native
              height={200}
              //yAxisLabel={}
              chartConfig={{
                //backgroundColor: 'white',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', // solid background lines with no dashes
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </View>
    </>
    ) : null }

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
    </>
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

export default Chart;