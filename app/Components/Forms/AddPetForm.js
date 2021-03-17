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
    age: null,
    breed: null,
    size: null,
    color: null,
    photo: null,
    type: "dog",
    //error: null,
    //fields: [],
    errors: {}, // dict
  };

   handleValidation(){

              let errors = {};
              errors["name"] = null;
              errors["photo"] = null;
              let formIsValid = true;
              console.log(this.state.name)
              //Name
              if(this.state.name == ""){

                 formIsValid = false;
                 errors["name"] = "Name cannot be empty";
              }
              else{
                 if(!this.state.name.match(/^[a-zA-Z]+$/)){
                                     formIsValid = false;
                                     errors["name"] = "Only letters in name";
                 }
              }

              //Photo
              if(this.state.photo == null){
                               formIsValid = false;
                               errors["photo"] = "You must load a photo";
              }


             //console.log(errors);
             this.setState({errors: errors});
             return false;
   }

  registerPet() {

        if (this.handleValidation()){
        console.log("Add animal");
        db.addUserAnimal(
          this.context.uid,
          this.state.name,
          this.state.age,
          this.state.breed,
          this.state.size,
          this.state.color,
          this.state.photo,
          this.state.type
        );
       }
  }

  setPhoto = (photo) => {
    this.setState({ photo: photo });
    console.log("photo: " + this.state.photo);
  };

  render() {
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

        {this.state.errors["name"]!= null  ? (<Text style={styles.error}>{this.state.errors["name"]}</Text>) : null }

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
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Size"
            placeholderTextColor="#616161"
            returnKeyType="next"
            value={this.state.size}
            onChangeText={(size) => this.setState({ size })}
          />
        </View>
        <View style={mainStyle.form}>
                  <TextInput
                    style={mainStyle.inputText}
                    placeholder="Color"
                    placeholderTextColor="#616161"
                    returnKeyType="next"
                    value={this.state.color}
                    onChangeText={(color) => this.setState({ color })}
                  />
                </View>
        <View style={mainStyle.form}>
          <Picker
            selectedValue={this.state.type}
            style={{ height: 50, width: "100%" }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ type: itemValue })
            }
          >
            <Picker.Item label="Dog" value="dog" />
            <Picker.Item label="Cat" value="cat" />
          </Picker>
        </View>
        <ImagePickerExample setPhoto={this.setPhoto}></ImagePickerExample>
        {this.state.errors["photo"]!=null ? (<Text style={styles.error}>{this.state.errors["photo"]}</Text>) : null }

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
