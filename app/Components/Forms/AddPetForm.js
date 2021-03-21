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
} from "react-native";
import db from "../../firebase/DatabaseManager";
//import Animal from "../../firebase/Animal.js";
import ImagePickerExample from "../../screens/camera";
import { AuthContext } from "../AuthContext";
import { withNavigation } from "react-navigation";
import { Picker } from "@react-native-picker/picker";

import mainStyle from "../../styles/mainStyle";

class AddPetForm extends Component {
  static contextType = AuthContext;
  state = {
    name: "",
    age: "",
    photo: null,
    typeSelected: "Dog",
    prevTypeSelected: "Dog",
    types: ["Dog", "Cat"],
    breedSelected: "None",
    breedsDog: ["None", "Labrador", "Golden Retriever"],
    breedsCat: ["None", "Bombay"],
    colorSelected: "White",
    colors: ["White", "Black"],
    sizeSelected: "Small",
    sizes: ["Small", "Medium", "Big"],
    errors: {}, // dict
  };

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

    if(this.state.age == ""){
      formIsValid = false;
      errors["age"] = "Age cannot be empty";
    }
    else {
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

  registerPet() {
    if (this.handleValidation()) {
      console.log("Registering pet...");
      db.addUserAnimal(
        this.context.uid,
        this.state.name,
        this.state.age,
        this.state.breedSelected,
        this.state.sizeSelected,
        this.state.colorSelected,
        this.state.photo,
        this.state.typeSelected
      );
    }
  }

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

  render() {
    let types = this.state.types.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let breedsDog = this.state.breedsDog.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let breedsCat = this.state.breedsCat.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let colors = this.state.colors.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let sizes = this.state.sizes.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    return (
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <KeyboardAvoidingView
          style={mainStyle.container}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
          enabled={Platform.OS === "ios" ? true : false}
        ></KeyboardAvoidingView>
        <Text style={styles.title}>Add new Pet</Text>
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
            onValueChange={(type) => this.setState({ typeSelected: type })}
          >
            {types}
          </Picker>
        </View>
        <View style={mainStyle.form}>
          <Picker
            selectedValue={this.state.breedSelected}
            style={{ height: 50, width: "100%" }}
            onValueChange={(breed) => this.setState({ breedSelected: breed })}
          >
            {this.state.typeSelected == "Dog" ? breedsDog : breedsCat}
          </Picker>
        </View>

        <View style={mainStyle.form}>
          <Picker
            selectedValue={this.state.colorSelected}
            style={{ height: 50, width: "100%" }}
            onValueChange={(color) => this.setState({ colorSelected: color })}
          >
            {colors}
          </Picker>
        </View>

        <View style={mainStyle.form}>
          <Picker
            selectedValue={this.state.sizeSelected}
            style={{ height: 50, width: "100%" }}
            onValueChange={(size) => this.setState({ sizeSelected: size })}
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
  input: {
    fontSize: 20,
    borderColor: "#707070",
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 25.5,
  },
  inputView: {
    width: "80%",
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
});

export default withNavigation(AddPetForm);
