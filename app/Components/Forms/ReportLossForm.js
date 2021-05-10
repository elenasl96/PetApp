import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import dbLostPet from "../../firebase/Database/Functions/dbLostPet";
import { AuthContext } from "../AuthContext";
import { withNavigation } from "react-navigation";
import mainStyle from "../../styles/mainStyle";
import { ScrollView } from "react-native-gesture-handler";
import PhotoBox from "../Custom/PhotoBox";
import { Picker } from "@react-native-picker/picker";
import constants from "../../shared/constants";

class ReportLossForm extends Component {
  static contextType = AuthContext;
  state = {
    name: "",
    photo: null,
    size: null,
    color: null,
    breed: "",
    notes: null,
    place: null,
    email: null,
    telephone: null,
    mounted: false,
    errors: {},
  };

  componentDidMount() {
    this.setState({ mounted: true });
    if (this.props.pet != null) {
      pet = this.props.pet;
      this.setState({
        name: pet.getName(),
        photo: pet.getPhoto(),
        size: pet.getSize(),
        color: pet.getColor(),
        breed: pet.getBreed(),
      });
    }
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (!this.state.name.match(/^[a-zA-Z]+$/)) {
      formIsValid = false;
      errors["name"] = "Only letters in name";
    }
    if (!this.state.breed.match(/^[a-zA-Z]+$/)) {
      formIsValid = false;
      errors["breed"] = "Only letters in breed";
    }

    if (isNaN(this.state.telephone)) {
      formIsValid = false;
      errors["number"] = "Telephone must be a number";
    }
    console.log(errors);
    this.setState({ errors: errors });
    return formIsValid;
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  reportLoss = () => {
    const pet = this.props.pet;
    console.log("pet");
    console.log(this.context.uid);
    if (this.handleValidation()) {
      dbLostPet
        .addLostPetNotify(
          this.state.name,
          this.state.photo,
          this.state.size,
          this.state.color,
          this.state.breed,
          this.state.notes,
          this.state.place,
          this.context.uid,
          this.state.email,
          this.state.telephone
        )
        .then((doc) => {
          console.log("LOST PET ID TO ADD");
          console.log(doc.id);
          this.context.lostPets.push(doc.id);
          this.context.saveLostPets(this.context.lostPets);
          console.log("LOST PETS TO UPDATE:");
          console.log(this.context.lostPets);
          this.props.close();
        });
    }
  };

  reportSight = () => {
    if (this.handleValidation()) {
      dbLostPet
        .addLostPetSeen(
          this.state.photo,
          this.state.size,
          this.state.color,
          this.state.breed,
          this.state.notes,
          this.state.place,
          this.context.uid,
          this.state.email,
          this.state.telephone
        )
        .then(() => {
          this.props.close();
        });
    }
  };

  setPhoto = (photo) => {
    if (this.state.mounted) {
      this.setState({ photo: photo });
    }
  };

  render() {
    let types = constants.TYPES_PETS.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let breedsDog = constants.BREEDS_DOG.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let breedsCat = constants.BREEDS_CAT.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let colors = constants.COLORS_PETS.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let sizes = constants.SIZES_PETS.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.close();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.props.sight ? (
                <Text style={styles.title}>Report Sight</Text>
              ) : (
                <Text style={styles.title}>Report loss</Text>
              )}

              {this.props.pet == null && !this.props.sight ? (
                <View style={mainStyle.form}>
                  <TextInput
                    style={mainStyle.inputText}
                    placeholder="Name"
                    placeholderTextColor="#616161"
                    returnKeyType="next"
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                  />
                </View>
              ) : null}
              {this.state.errors["name"] != null ? (
                <Text style={styles.error}>{this.state.errors["name"]}</Text>
              ) : null}
              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <Picker
                    selectedValue={this.state.size}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(size) => this.setState({ size: size })}
                  >
                    {sizes}
                  </Picker>
                </View>
              ) : null}

              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <Picker
                    selectedValue={this.state.color}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(color) => this.setState({ color: color })}
                  >
                    {colors}
                  </Picker>
                </View>
              ) : null}
              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <TextInput
                    style={mainStyle.inputText}
                    placeholder="Breed"
                    placeholderTextColor="#616161"
                    returnKeyType="next"
                    value={this.state.breed}
                    onChangeText={(breed) => this.setState({ breed })}
                  />
                </View>
              ) : null}
              {this.state.errors["breed"] != null ? (
                <Text style={styles.error}>{this.state.errors["breed"]}</Text>
              ) : null}
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Notes"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  value={this.state.notes}
                  onChangeText={(notes) => this.setState({ notes })}
                />
              </View>
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Place"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="addressCity"
                  value={this.state.place}
                  onChangeText={(place) => this.setState({ place })}
                />
              </View>
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Email"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={this.state.email}
                  onChangeText={(email) => this.setState({ email })}
                />
              </View>
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Telephone Number"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="telephoneNumber"
                  value={this.state.telephone}
                  onChangeText={(telephone) => this.setState({ telephone })}
                />
              </View>
              {this.state.errors["number"] != null ? (
                <Text style={styles.error}>{this.state.errors["number"]}</Text>
              ) : null}

              {this.props.pet == null ? (
                <PhotoBox setPhoto={this.setPhoto} isUpdate={false}></PhotoBox>
              ) : null}

              {this.props.sight ? (
                <TouchableOpacity
                  style={{
                    width: "50%",
                    marginTop: 10,
                    marginBottom: 40,
                    alignSelf: "center",
                  }}
                  onPress={this.reportSight.bind(this)}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Report sight</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width: "50%",
                    marginTop: 10,
                    marginBottom: 40,
                    alignSelf: "center",
                  }}
                  onPress={this.reportLoss.bind(this)}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Report Loss</Text>
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 20,
    borderColor: "#707070",
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 25.5,
  },
  inputView: {
    width: "100%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    marginTop: 15,
    fontSize: 30,
    color: "#000",
    alignSelf: "center",
  },
  inputText: {
    height: 50,
    color: "white",
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#F9844A",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  buttonText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ReportLossForm;
