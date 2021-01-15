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
} from "react-native";
import db from "../../firebase/DatabaseManager";
import ImagePickerExample from "../../screens/camera";
import { AuthContext } from "../AuthContext";

import mainStyle from "../../styles/mainStyle";
import * as Location from "expo-location";

export default class AddPlaceForm extends Component {
  static contextType = AuthContext;
  state = {
    name: null,
    type: null,
    description: null,
    photo: null,
    address: null,
  };

  async registerPlace() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    Location.geocodeAsync(this.state.address).then((coordinates) => {
      console.log("latitude");
      console.log(coordinates[0].latitude);
      db.addPlace(
        this.state.name,
        this.state.type,
        this.state.description,
        this.state.photo,
        this.context.uid,
        this.state.address,
        coordinates[0].latitude,
        coordinates[0].longitude,
        "latitudeDelta",
        "longitudeDelta"
      );
    });
  }

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
        <Text style={styles.title}>Add new place</Text>
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
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Type"
            placeholderTextColor="#616161"
            returnKeyType="next"
            value={this.state.type}
            onChangeText={(type) => this.setState({ type })}
          />
        </View>
        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Description"
            placeholderTextColor="#616161"
            returnKeyType="next"
            multiline
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
        <ImagePickerExample
          photo={this.state.photo}
          setPhoto={(photo) => this.setState({ photo })}
        ></ImagePickerExample>
        <Text style={styles.error}>{this.state.error}</Text>

        <TouchableOpacity
          style={{
            width: "50%",
            marginTop: 10,
            marginBottom: 40,
            alignSelf: "center",
          }}
          onPress={this.registerPlace.bind(this)}
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