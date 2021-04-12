import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
} from "react-native";
import dbUserAnimal from "../../firebase/Database/Functions/dbUserAnimal";
import storageManager from "../../firebase/Storage/storage";
import ImagePickerExample from "../Custom/camera";
import { AuthContext } from "../AuthContext";
import { withNavigation } from "react-navigation";
import { Picker } from "@react-native-picker/picker";
import constants from "../../shared/constants";

import mainStyle from "../../styles/mainStyle";
import { ScrollView } from "react-native-gesture-handler";

class AddPetForm extends Component {
  static contextType = AuthContext;
  state = {
    name: "",
    age: "",
    photo: null,
    url: null,
    typeSelected: "Dog",
    prevTypeSelected: "Dog",
    breedSelected: "None",
    colorSelected: "White",
    sizeSelected: "Small",
    errors: {}, // dict
    visible: false,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    this.setState({ visible: this.props.visible });
  }

  handleValidation() {
    let errors = {};
    errors["name"] = null;
    errors["photo"] = null;
    errors["age"] = null;
    let formIsValid = true;
    //Name
    if (this.state.name == "") {
      formIsValid = false;
      errors["name"] = "Name cannot be empty";
    } else {
      if (!this.state.name.match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["name"] = "Only letters in name";
      }
    }

    //Photo
    if (this.state.photo == null) {
      formIsValid = false;
      errors["photo"] = "You must load a photo";
    }

    //Age

    if (this.state.age == "") {
      formIsValid = false;
      errors["age"] = "Age cannot be empty";
    } else {
      if (isNaN(this.state.age)) {
        formIsValid = false;
        errors["age"] = "Age must be a number";
      } else {
        if (
          this.state.age > 20 ||
          this.state.age < 0 ||
          !Number.isInteger(Number(this.state.age))
        ) {
          console.log(this.state.age > 20);
          console.log(this.state.age < 0);
          console.log(!Number.isInteger(this.state.age));
          formIsValid = false;
          errors["age"] = "Age is an integer between 0 and 20 ";
        }
      }
    }
    //console.log(errors);
    this.setState({ errors: errors });
    return formIsValid;
  }

  registerPet = async () => {
    if (this.handleValidation()) {
      console.log("Registering pet...");
      /*
      this.upload(this.state.photo).then((url) => {
          //console.log("url: " + this.state.url);
          dbUserAnimal.addUserAnimal(
                  this.context.uid,
                  this.state.name,
                  this.state.age,
                  this.state.breedSelected,
                  this.state.sizeSelected,
                  this.state.colorSelected,
                  this.state.url,
                  this.state.typeSelected
                );
      });*/
      const response = await fetch(this.state.photo);
      const file = await response.blob();
      storageManager.toStorage(this.context.uid, file, "pets").then((url) => {
        console.log("url: " + url);
        //this.state.url = url;
        dbUserAnimal.addUserAnimal(
          this.context.uid,
          this.state.name,
          this.state.age,
          this.state.breedSelected,
          this.state.sizeSelected,
          this.state.colorSelected,
          url,
          this.state.typeSelected
        );
      });
    }
  };

  upload = async (uri) => {
    const response = await fetch(uri);
    const file = await response.blob();
    storageManager.toStorage(this.context.uid, file, "pets").then((url) => {
      console.log("url: " + url);
      this.state.url = url;
    });
  };

  setPhoto = (photo) => {
    this.setState({ photo: photo });
    console.log("photo: " + this.state.photo);
  };

  componentDidUpdate() {
    if (this.state.prevTypeSelected != this.state.typeSelected) {
      this.state.breedSelected = "None";
      this.state.prevTypeSelected = this.state.typeSelected;
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

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
              <Text style={styles.title}>+ Pet </Text>
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Name"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="name"
                  value={this.state.name}
                  onChangeText={(name) => this.setState({ name })}
                />
              </View>
              {this.state.errors["name"] != null ? (
                <Text style={styles.error}>{this.state.errors["name"]}</Text>
              ) : null}

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Age"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  value={this.state.age}
                  onChangeText={(age) => this.setState({ age })}
                />
              </View>

              {this.state.errors["age"] != null ? (
                <Text style={styles.error}>{this.state.errors["age"]}</Text>
              ) : null}

              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.typeSelected}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(type) =>
                    this.setState({ typeSelected: type })
                  }
                >
                  {types}
                </Picker>
              </View>
              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.breedSelected}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(breed) =>
                    this.setState({ breedSelected: breed })
                  }
                >
                  {this.state.typeSelected == "Dog" ? breedsDog : breedsCat}
                </Picker>
              </View>

              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.colorSelected}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(color) =>
                    this.setState({ colorSelected: color })
                  }
                >
                  {colors}
                </Picker>
              </View>

              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.sizeSelected}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(size) =>
                    this.setState({ sizeSelected: size })
                  }
                >
                  {sizes}
                </Picker>
              </View>
              <ImagePickerExample setPhoto={this.setPhoto}></ImagePickerExample>
              {this.state.errors["photo"] != null ? (
                <Text style={styles.error}>{this.state.errors["photo"]}</Text>
              ) : null}

              <TouchableOpacity
                style={{
                  width: "50%",
                  marginTop: 10,
                  marginBottom: 40,
                  alignSelf: "center",
                }}
                onPress={this.registerPet.bind(this)}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Register Pet</Text>
                </View>
              </TouchableOpacity>
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

export default withNavigation(AddPetForm);
