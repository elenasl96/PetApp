import React from "react";
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
import "firebase/firestore";
import { auth } from "../firebase/firebaseconfig.js";
import * as Facebook from "expo-facebook";

import mainStyle from "../styles/mainStyle";
import db from "./../firebase/DatabaseManager.js";
import { AuthContext } from "../Components/AuthContext.js";
import { Picker } from "@react-native-picker/picker";

class SignUpScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    name: "",
    email: "",
    password: "",
    address: "",
    type: "",
    errorMessage: "",
    loading: false,
    mounted: true,
  };

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false });
  }

  async signUpWithEmail() {
    await auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
        auth().setPersistence(auth.Auth.Persistence.LOCAL);
        db.addUser(user.uid, this.state.name, "", "user", "via veglia").then(
          "User Registered"
        );
        db.getUser(user.uid).then((userFromDb) => {
          this.context.saveUser(userFromDb);
        });
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          this.onLoginFailure.bind(this)("Weak Password!");
        } else {
          this.onLoginFailure.bind(this)(errorMessage);
        }
      });
  }

  async signInWithFacebook() {
    try {
      var appId = "401120257739037";
      var appName = "Pet App";
      await Facebook.initializeAsync({ appId, appName });

      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (type === "success") {
        await auth().setPersistence(auth.Auth.Persistence.LOCAL);
        const credential = auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await auth().signInWithCredential(
          credential
        );
        const user = auth().currentUser;
        // .then(this.onLoginSuccess.bind(this))
        if (facebookProfileData.additionalUserInfo.isNewUser) {
          db.addUser(
            auth().currentUser.uid,
            facebookProfileData.additionalUserInfo.profile.name,
            facebookProfileData.additionalUserInfo.profile.picture.data.url,
            "user",
            "via veglia"
          ).then("User Registered");
        }

        db.getUser(user.uid).then((userFromDb) => {
          this.context.saveUser(userFromDb);
        });

        //console.log("Facebook data:");
        //console.log(facebookProfileData);
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      );
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={mainStyle.container}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
            enabled={Platform.OS === "ios" ? true : false}
          >
            <Text style={mainStyle.logo}>PetApp</Text>
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
                placeholder="Address"
                placeholderTextColor="#616161"
                returnKeyType="next"
                textContentType="addressCity"
                value={this.state.address}
                onChangeText={(address) => this.setState({ address })}
              />
            </View>
            <View style={mainStyle.form}>
              <TextInput
                style={mainStyle.inputText}
                placeholder="Password"
                placeholderTextColor="#616161"
                returnKeyType="done"
                textContentType="newPassword"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
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
                <Picker.Item label="Basic user" value="user" />
                <Picker.Item label="Business user" value="businessUser" />
              </Picker>
            </View>
            {this.renderLoading()}
            <Text style={styles.error}>{this.state.error}</Text>
            <TouchableOpacity
              style={styles.text}
              onPress={this.signUpWithEmail.bind(this)}
            >
              <Text>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "80%", marginTop: 10 }}
              onPress={this.signInWithFacebook.bind(this)}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Continue with Facebook</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "80%", marginTop: 15 }}
              onPress={this.context.signInWithGoogle}
            >
              <View style={styles.googleButton}>
                <Text style={styles.text}>Continue with Google</Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 10 }}>
              <Text
                style={styles.text}
                onPress={() => {
                  //db.getUser("Anna Black");
                  this.props.navigation.navigate("SignIn");
                }}
              >
                Already have an account?
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
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
  inputText: {
    height: 50,
    color: "white",
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3A559F",
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
  googleButton: {
    backgroundColor: "#FFFFFF",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#707070",
  },
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
});
export default SignUpScreen;
