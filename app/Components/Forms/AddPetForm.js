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
import ImagePickerExample from "../../screens/camera";
import { AuthContext } from "../AuthContext";
import { withNavigation } from "react-navigation";

import mainStyle from "../../styles/mainStyle";

class AddPetForm extends Component {
  static contextType = AuthContext;
  state = {
    name: null,
    type: null,
    description: null,
    photo: null,
    address: null,
  };

  registerPet() {
    db.addPlace(
      this.state.name,
      this.state.type,
      this.state.description,
      this.state.photo,
      this.context.uid,
      this.state.address
    );
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
            placeholder="description"
            placeholderTextColor="#616161"
            returnKeyType="next"
            value={this.state.description}
            onChangeText={(description) => this.setState({ description })}
          />
        </View>
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Address"
            placeholderTextColor="#616161"
            returnKeyType="next"
            textContentType="addressCity"
            value={this.state.address}
            onChangeText={(address) => this.setState({ address })}
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
            <Text style={styles.buttonText}>Register Place</Text>
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
