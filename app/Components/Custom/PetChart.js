import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TextInput,
} from "react-native";
import dbUserAnimal from "../../firebase/database/functions/DbUserAnimal";
import utils from "../../shared/Utilities";
import mainStyle from "../../styles/MainStyle";
import { AuthContext } from "./AuthContext";

import { LineChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class Chart extends React.Component {
  state = {
    labels: [],
    dataWeight: [],
    dataHeight: [],
    data: [],
    newtype: null,
    newdata: "",
    deletesample: "",
    errors: {}, // dict
    mounted: true,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ newtype: "weight" });
    this.setState({ mounted: true });

    const petID = this.props.petID;

    dbUserAnimal
      .getAnimalStatSamples(this.context.uid, petID, "weight")
      .then((WIDs) => {
        WIDs.map((wid) => {
          dbUserAnimal
            .getAnimalStatSample(
              this.context.uid,
              this.props.petID,
              "weight",
              wid
            )
            .then((sample) => {
              if (this.state.mounted) {
                this.state.dataWeight.push(sample.value);
                this.state.data.push(sample.value);
                this.setState({ mounted: true });
              }
            });
        });
      });

    dbUserAnimal
      .getAnimalStatSamples(this.context.uid, petID, "height")
      .then((HIDs) => {
        HIDs.map((hid) => {
          dbUserAnimal
            .getAnimalStatSample(
              this.context.uid,
              this.props.petID,
              "height",
              hid
            )
            .then((sample) => {
              if (this.state.mounted) {
                this.state.dataHeight.push(sample.value);
                this.setState({ mounted: true });
              }
            });
        });
      });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
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
    if (this.state.mounted) {
      this.setState({ errors: errors });
    }
    return formIsValid;
  }

  addPetStatSample = () => {
    if (this.handleValidation()) {
      //console.log("Valid sample");
      let errors = {};
      errors["samples"] = null;

      if (this.state.newtype == "weight" && this.state.mounted) {
        this.state.dataWeight.push(Number(this.state.newdata));
        this.showWeight();
      }

      if (this.state.newtype == "height" && this.state.mounted) {
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

      if (this.state.mounted) {
        this.setState({ errors: errors });
      }
    }
  };

  showWeight = () => {
    this.state.data = this.state.dataWeight;
    let errors = {};
    if (this.state.mounted) {
      this.setState({ errors: errors }); // clean errors
      this.setState({ newtype: "weight" });
    }
  };

  showHeight = () => {
    this.state.data = this.state.dataHeight;
    let errors = {};
    if (this.state.mounted) {
      this.setState({ errors: errors }); // clean errors
      this.setState({ newtype: "height" });
    }
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

    if (this.state.mounted) {
      this.setState({ errors: errors });
    }
    //db.deleteAnimalStatSample(this.context.uid,this.props.navigation.state.params.petID,this.state.newtype,id);
  };

  render() {
    const data = this.state.data;
    const labels = [];
    let chartWidth;
    if (Dimensions.get("window").width > 900) {
      chartWidth = Dimensions.get("window").width * 0.47;
    } else {
      chartWidth = Dimensions.get("window").width * 0.9;
    }

    return (
      <View style={{ flex: 1, flexBasis: 400 }}>
        <Text style={styles.title}>Pet stats</Text>
        <View style={styles.statisticButtons}>
          <TouchableHighlight
            style={mainStyle.roundButton}
            onPress={this.showWeight.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={styles.subtitle}>Weight </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={mainStyle.roundButton}
            onPress={this.showHeight.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={styles.subtitle}>Height </Text>
          </TouchableHighlight>
        </View>

        {data.length != 0 ? (
          <View>
            <View style={styles.container}>
              <LineChart
                data={{
                  labels: labels,
                  datasets: [{ data: data }],
                }}
                width={chartWidth} // from react-native
                height={200}
                //yAxisLabel={}
                chartConfig={{
                  //backgroundColor: 'white',
                  backgroundGradientFrom: "#eff3ff",
                  backgroundGradientTo: "#efefef",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 15,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "", // solid background lines with no dashes
                  },
                }}
                bezier
                style={{
                  margin: 10,
                  borderRadius: 15,
                }}
              />
            </View>
            <View>
              <TouchableHighlight
                onPress={this.deleteStatSample.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <View style={styles.deleteButton}>
                  <AntDesign name="delete" size={24} color="red" />
                  <Text style={{ marginLeft: 8, textAlignVertical: "center" }}>
                    Delete last statistic
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        ) : (
          <Text style={styles.text}>
            No samples yet. Add new samples below.
          </Text>
        )}

        <View style={styles.sampleBox}>
          <View style={styles.healthStatus}>
            <Text>
              <MaterialCommunityIcons
                name="tag-text-outline"
                size={24}
                color="black"
              />
            </Text>
            <Text style={{ marginHorizontal: 15, marginBottom: 10 }}>
              Add new sample {this.state.newtype}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              paddingHorizontal: 15,
            }}
          >
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Value"
                placeholderTextColor="#616161"
                returnKeyType="next"
                textContentType="name"
                value={this.state.newdata}
                onChangeText={(newdata) => this.setState({ newdata })}
              />
            </View>

            <TouchableHighlight
              style={mainStyle.roundButton}
              onPress={this.addPetStatSample.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <AntDesign name="plus" size={24} color="black" />
            </TouchableHighlight>
          </View>
        </View>

        {this.state.errors["samples"] != null ? (
          <Text style={styles.error}>{this.state.errors["samples"]}</Text>
        ) : null}

        {this.state.errors["delete"] != null ? (
          <Text style={styles.error}>{this.state.errors["delete"]}</Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },

  subtitle: {
    color: "#4cc9f0",
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    textAlign: "center",
  },
  statisticButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  buttons: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  buttonText: {
    alignSelf: "center",
  },
  form: {
    borderRadius: 30,
    width: "60%",
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 30,
    elevation: 1,
  },
  input: {
    flex: 1,
    flexDirection: "column",
  },

  descriptionContainer: {
    padding: 10,
  },

  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
  sampleBox: {
    backgroundColor: "#cbe5f6",
    alignSelf: "center",
    elevation: 2,
    width: "90%",
    maxWidth: 500,
    paddingVertical: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  healthStatus: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  deleteButton: {
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",

    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
  },
  title: {
    color: "#4cc9f0",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
});

export default Chart;
