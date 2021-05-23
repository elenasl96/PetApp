import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import mainStyle from "../../styles/mainStyle";
import dbUserAnimal from "../../firebase/Database/Functions/dbUserAnimal";
import dbAdoptableAnimal from "../../firebase/Database/Functions/dbAdoptableAnimal";
import constants from "../../shared/constants";
import { AuthContext } from "../AuthContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

class DiseasePanel extends React.Component {
  // props petID , type

  state = {
    diseases: {},
    diseaseShown: null,
    diseaseSelected: null,
    mounted: true,
    errors: {},
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    const isAdoptable = this.props.isAdoptable;
    const petID = this.props.petID;

    if (!isAdoptable) {
      const uid = this.context.uid;
      dbUserAnimal.getAnimalDiseases(uid, petID).then((DIDs) => {
        DIDs.map((did) => {
          dbUserAnimal.getAnimalDisease(uid, petID, did).then((disease) => {
            if (this.state.diseaseShown == null && this.state.mounted) {
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
      });
    } else {
      const pid = this.props.pid;
      dbAdoptableAnimal.getAdoptableAnimalDiseases(pid, petID).then((DIDs) => {
        console.log("DIDs: " + DIDs);
        if (DIDs.length != 0) {
          DIDs.map((did) => {
            dbAdoptableAnimal
              .getAdoptableAnimalDisease(pid, petID, did)
              .then((disease) => {
                if (this.state.diseaseShown == null && this.state.mounted) {
                  this.setState({ diseaseShown: disease.name });
                }
                dbAdoptableAnimal
                  .getDiseaseDescription(disease.name)
                  .then((descriptions) => {
                    this.state.diseases[disease.name] = descriptions[0];
                    this.setState({ mounted: true });
                  });
              });
          });
        }
      });
    }

    const type = this.props.type;

    if (this.state.mounted) {
      if (type == "Dog") {
        this.setState({ diseaseSelected: constants.DISEASES_DOG[0] });
      } else {
        this.setState({ diseaseSelected: constants.DISEASES_CAT[0] });
      }
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  addDisease = () => {
    var disease = this.state.diseaseSelected;
    var diseases = Object.keys(this.state.diseases);
    let errors = {};

    if (diseases.includes(disease)) {
      errors["addDisease"] = "Disease already present!";
      console.log(errors["addDisease"]);
    } else {
      if (!this.props.isAdoptable) {
        dbUserAnimal.addAnimalDisease(
          this.context.uid,
          this.props.petID,
          disease
        );
      } else {
        dbAdoptableAnimal.addAdoptableAnimalDisease(
          this.props.pid,
          this.props.petID,
          disease
        );
      }

      if (this.state.diseaseShown == null && this.state.mounted) {
        this.setState({ diseaseShown: disease });
      }
      if (!this.props.isAdoptable) {
        dbUserAnimal.getDiseaseDescription(disease).then((descriptions) => {
          this.state.diseases[disease] = descriptions[0];
          this.setState({ mounted: true });
        });
      } else {
        dbAdoptableAnimal
          .getDiseaseDescription(disease)
          .then((descriptions) => {
            this.state.diseases[disease] = descriptions[0];
            this.setState({ mounted: true });
          });
      }
    }

    if (this.state.mounted) {
      this.setState({ errors: errors });
      this.setState({ mounted: true });
    }
  };

  deleteDisease = () => {
    var disease = this.state.diseaseShown;
    let errors = {};

    if (!this.props.isAdoptable) {
      dbUserAnimal.deleteAnimalDiseaseByName(
        this.context.uid,
        this.props.petID,
        disease
      );
    } else {
      dbAdoptableAnimal.deleteAdoptableAnimalDiseaseByName(
        this.props.pid,
        this.props.petID,
        disease
      );
    }

    delete this.state.diseases[disease];
    if (this.state.mounted) {
      this.setState({ errors: errors }); // clean errors
      var diseases = Object.keys(this.state.diseases);
      if (diseases.length != 0) {
        this.setState({ diseaseShown: diseases[0] });
        this.setState({ descriptionShown: this.state.diseases[diseases[0]] });
      } else {
        this.setState({ diseaseShown: null });
        this.setState({ descriptionShown: null });
      }
    }
  };

  render() {
    const descriptionShown = this.state.diseases[this.state.diseaseShown];
    const temp = Object.keys(this.state.diseases);
    const isAdoptable = this.props.isAdoptable;
    const isEditable = this.props.isEditable;

    let diseases = temp.map((s) => {
      //console.log("s: "+ s);
      return (
        <TouchableHighlight
          style={styles.disease}
          value={s}
          key={s}
          onPress={() => this.setState({ diseaseShown: s })}
        >
          <View style={styles.info}>
            <Text style={{ fontWeight: "bold" }}>{s}</Text>
          </View>
        </TouchableHighlight>
      );
    });

    var diseasesSelectable = [];

    if (this.props.type == "Dog") {
      diseasesSelectable = constants.DISEASES_DOG.map((s, i) => {
        return <Picker.Item key={i} value={s} label={s} />;
      });
    } else {
      diseasesSelectable = constants.DISEASES_CAT.map((s, i) => {
        return <Picker.Item key={i} value={s} label={s} />;
      });
    }

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.descriptionContainer}>
          {temp.length != 0 ? (
            <Text style={styles.title}>
              Ough! Your pet is suffering of some diseases... Monitor it and
              checkout your daily feed to retrieve suggestions!
            </Text>
          ) : (
            <View style={styles.healthStatus}>
              <FontAwesome5 name="heartbeat" size={24} color="red" />
              <Text
                style={{
                  textAlignVertical: "center",
                  marginLeft: 10,
                }}
              >
                The pet is in good health, great!
              </Text>
            </View>
          )}

          <ScrollView
            style={{ marginHorizontal: 10 }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {diseases}
          </ScrollView>

          {temp.length != 0 ? (
            <View
              style={{
                marginHorizontal: 20,
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "flex-end",
              }}
            >
              <Text style={styles.diseaseDescription}>{descriptionShown}</Text>
              <TouchableHighlight
                onPress={this.deleteDisease.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <View style={styles.deleteButton}>
                  <AntDesign name="delete" size={24} color="red" />
                </View>
              </TouchableHighlight>
            </View>
          ) : null}
        </View>

        {isEditable ? (
          <View style={styles.diseaseBox}>
            <View style={styles.healthStatus}>
              <Text>
                <MaterialCommunityIcons
                  name="tag-heart-outline"
                  size={24}
                  color="black"
                />
              </Text>

              <Text style={{ marginHorizontal: 15, marginBottom: 10 }}>
                Add diseases
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
                style={mainStyle.roundButton}
                onPress={this.addDisease.bind(this)}
                underlayColor={"rgb(200,200,200)"}
              >
                <AntDesign name="plus" size={24} color="red" />
              </TouchableHighlight>
            </View>
          </View>
        ) : null}

        {this.state.errors["addDisease"] != null ? (
          <Text style={styles.error}>{this.state.errors["addDisease"]}</Text>
        ) : null}
      </View>
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
  text: {
    margin: 15,
  },
  diseaseDescription: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 2,
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
  buttonText: {
    alignSelf: "center",
  },
  disease: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 5,
    marginBottom: 5,
    padding: 10,
    elevation: 2,
  },
  title: {
    fontWeight: "400",
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 15,
  },

  descriptionContainer: {
    padding: 10,
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
  healthStatus: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  diseaseBox: {
    alignSelf: "center",
    backgroundColor: "#fde2e4",
    elevation: 2,
    width: "90%",
    maxWidth: 500,
    paddingVertical: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  form: {
    borderRadius: 30,
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 30,
    elevation: 1,
  },
  deleteButton: {
    flex: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 10,
    marginVertical: 5,
    elevation: 2,
  },
  descriptionContainer: {
    width: "90%",
    alignSelf: "center",
  },
});
export default DiseasePanel;
