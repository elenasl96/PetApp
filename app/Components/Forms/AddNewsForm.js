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

export default class AddNewsForm extends Component {
  static contextType = AuthContext;
  state = {
    title: "",
    text: "",
    errors: {}, // dict
  };

  handleValidation() {

      let errors = {};
      errors["title"] = null;
      errors["text"] = null;
      let formIsValid = true;

      //title
      if (this.state.title == "") {
        formIsValid = false;
        errors["title"] = "Title cannot be empty";
      }

      //text
      if (this.state.text == "") {
              formIsValid = false;
              errors["text"] = "Text cannot be empty";

      }

      this.setState({ errors: errors });
      return formIsValid;

     }

  addNews() {
    console.log("AddNews");
    if (this.handleValidation()){
    console.log("Valid");
    const pid = this.props.pid;
    db.addNews(pid, this.state.title, this.state.text);
    }
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
        <Text style={styles.title}>Write news</Text>

        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="Title"
            placeholderTextColor="#616161"
            returnKeyType="next"
            value={this.state.title}
            onChangeText={(title) => this.setState({ title })}
          />
        </View>

        {this.state.errors["title"] != null ? (
                  <Text style={styles.error}>{this.state.errors["title"]}</Text>
                ) : null}

        <View style={mainStyle.form}>
          <TextInput
            style={mainStyle.inputText}
            placeholder="News"
            placeholderTextColor="#616161"
            returnKeyType="next"
            multiline
            value={this.state.text}
            onChangeText={(text) => this.setState({ text })}
          />
        </View>

        {this.state.errors["text"] != null ? (
                          <Text style={styles.error}>{this.state.errors["text"]}</Text>
                        ) : null}

        <TouchableOpacity
          style={{
            width: "50%",
            marginTop: 10,
            marginBottom: 40,
            alignSelf: "center",
          }}
          onPress={this.addNews.bind(this)}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Publish news</Text>
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
