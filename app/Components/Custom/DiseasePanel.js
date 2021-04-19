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

import { Picker } from "@react-native-picker/picker";
import mainStyle from "../../styles/mainStyle";
import dbUserAnimal from "../../firebase/Database/Functions/dbUserAnimal";
import dbAdoptableAnimal from "../../firebase/Database/Functions/dbAdoptableAnimal";
import constants from "../../shared/constants";
import { AuthContext } from "../AuthContext";

class DiseasePanel extends React.Component {   // props petID , type

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

     if(!isAdoptable){
       const uid = this.context.uid;
       dbUserAnimal.getAnimalDiseases(uid,petID).then((DIDs) => {
         DIDs.map((did) => {
           dbUserAnimal
             .getAnimalDisease(
               uid,
               petID,
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
       });

     }
     else{
       const pid = this.props.navigation.state.params.pid;

       dbAdoptableAnimal.getAdoptableAnimalDiseases(pid,petID).then((DIDs) => {
                DIDs.map((did) => {
                  dbUserAnimal
                    .getAnimalDisease(
                      pid,
                      petID,
                      did
                    )
                    .then((disease) => {
                      if (this.state.diseaseShown == null) {
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
              });

     }

      const type = this.props.type;

         if (type == "Dog") {
           this.setState({ diseaseSelected: constants.DISEASES_DOG[0] });
         } else {
           this.setState({ diseaseSelected: constants.DISEASES_CAT[0] });
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

         if (!this.props.isAdoptable){
         dbUserAnimal.addAnimalDisease(
           this.context.uid,
           this.props.petID,
           disease
         );
        }
        else{
          dbAdoptableAnimal.addAdoptableAnimalDisease(
                     this.props.pid,
                     this.props.petID,
                     disease
          );
        }

         if (this.state.diseaseShown == null) {
           this.setState({ diseaseShown: disease });
         }
         if (!this.props.isAdoptable){
         dbUserAnimal.getDiseaseDescription(disease).then((descriptions) => {
           this.state.diseases[disease] = descriptions[0];
           this.setState({ mounted: true });
         });
         }
         else{
         dbAdoptableAnimal.getDiseaseDescription(disease).then((descriptions) => {
                    this.state.diseases[disease] = descriptions[0];
                    this.setState({ mounted: true });
                  });
         }
       }

       this.setState({ errors: errors });
       this.setState({ mounted: true });
     };

     deleteDisease = () => {
         var disease = this.state.diseaseShown;
         let errors = {};

         if (!this.props.isAdoptable){
             dbUserAnimal.deleteAnimalDiseaseByName(
               this.context.uid,
               this.props.petID,
               disease
             );
         }
         else{
             dbAdoptableAnimal.deleteAdoptableAnimalDiseaseByName(
                            this.props.pid,
                            this.props.petID,
                            disease
                          );
         }


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

     render(){
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

            if (this.props.type == "Dog") {
              diseasesSelectable = constants.DISEASES_DOG.map((s, i) => {
                return <Picker.Item key={i} value={s} label={s} />;
              });
            } else {
              diseasesSelectable = constants.DISEASES_CAT.map((s, i) => {
                return <Picker.Item key={i} value={s} label={s} />;
              });
            }

     return(
       <>
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
export default DiseasePanel;