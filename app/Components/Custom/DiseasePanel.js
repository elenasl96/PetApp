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
      <>
        {temp.length != 0 ? (
          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>
            Diseases
          </Text>
        ) : (
          <Text style={{ marginHorizontal: 15, marginVertical: 10 }}>
            The pet is in good health!
          </Text>
        )}

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {diseases}
        </ScrollView>

        {temp.length != 0 ? (
          <Text style={styles.text}>{descriptionShown}</Text>
        ) : null}

     { isEditable ? (

       <>

        <Text style={{ marginHorizontal: 15, marginBottom: 10 }}>
          Add diseases
        </Text>

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
            style={styles.button}
            onPress={this.addDisease.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={{ textAlign: "center" }}>Add</Text>
          </TouchableHighlight>

        </View>
        </>

        ): null }

        {this.state.errors["addDisease"] != null ? (
          <Text style={styles.error}>{this.state.errors["addDisease"]}</Text>
        ) : null}

        {temp.length != 0 ? (
          <TouchableHighlight
            style={styles.button}
            onPress={this.deleteDisease.bind(this)}
            underlayColor={"rgb(200,200,200)"}
          >
            <Text style={{ textAlign: "center" }}>Delete disease selected</Text>
          </TouchableHighlight>
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
  text: {
    margin: 15,
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
  button: {
    backgroundColor: "#F9844A",
    minWidth: 50,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginVertical: 5,
    marginHorizontal: 15,
    alignContent: "center",
    justifyContent: "center",
  },
  buttonText: {
    alignSelf: "center",
  },
  form: {
    borderRadius: 30,
    flex: 1,
    backgroundColor: "#43AA8B",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    paddingLeft: 30,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "powderblue",
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
export default DiseasePanel;
