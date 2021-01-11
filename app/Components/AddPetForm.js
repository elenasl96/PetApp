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
import db from "../firebase/DatabaseManager";
import ImagePickerExample from "../screens/camera";
import { AuthContext } from "../Components/AuthContext";

import mainStyle from "../styles/mainStyle";

export default class AddPetForm extends Component {
  static contextType = AuthContext;
  state = {
    name: null,
    age: null,
    breed: null,
    size: null,
    photo: null,
    diseases: null,
  };

  registerPet() {
    db.addUserAnimal(
      this.context.uid,
      "1",
      this.state.name,
      this.state.age,
      this.state.breed,
      this.state.size,
      "",
      this.state.diseases
    );
    this.props.navigation.navigate("App");
  }

  setPhoto = (photo) => {
    this.setState({ photo: photo });
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
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Age"
            placeholderTextColor="#616161"
            returnKeyType="next"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={this.state.age}
            onChangeText={(age) => this.setState({ age })}
          />
        </View>
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Size"
            placeholderTextColor="#616161"
            returnKeyType="next"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={this.state.size}
            onChangeText={(size) => this.setState({ size })}
          />
        </View>
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Breed"
            placeholderTextColor="#616161"
            returnKeyType="next"
            textContentType="addressCity"
            value={this.state.breed}
            onChangeText={(breed) => this.setState({ breed })}
          />
        </View>
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Diseases"
            placeholderTextColor="#616161"
            returnKeyType="next"
            textContentType="addressCity"
            value={this.state.diseases}
            onChangeText={(diseases) => this.setState({ diseases })}
          />
        </View>
        <Text style={[mainStyle.text, { margin: 10 }]}>Select an image:</Text>
        <ImagePickerExample setPhoto={this.setPhoto}></ImagePickerExample>
        <Text style={styles.error}>{this.state.error}</Text>

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
