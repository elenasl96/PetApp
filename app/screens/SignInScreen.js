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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth } from "../firebase/firebaseconfig.js";
import "firebase/firestore";

import mainStyle from "../styles/mainStyle";
import { AuthContext } from "../Components/AuthContext";

class SignInScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    email: "",
    password: "",
    errorMessage: "",
    loading: false,
    mounted: false,
  };

  renderLoading() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      );
    }
  }

  onLoginFailure(errorMessage) {
    if (this.state.mounted) {
      this.setState({ error: errorMessage, loading: false });
    }
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  async signInWithEmail() {
    if (this.state.email && this.state.password) {
      await auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((credential) => {
          auth().setPersistence(auth.Auth.Persistence.LOCAL);
          db.getUser(credential.user.uid).then((userFromDb) => {
            if (this.state.mounted) {
              this.context.saveUser(userFromDb);
            }
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
    } else {
      this.onLoginFailure.bind(this)("Fill in all the fields");
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
                placeholder="Password"
                placeholderTextColor="#616161"
                returnKeyType="done"
                textContentType="newPassword"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
              />
            </View>
            {this.renderLoading()}
            <Text style={mainStyle.error}>{this.state.error}</Text>
            <TouchableOpacity
              style={styles.signIn}
              onPress={this.signInWithEmail.bind(this)}
            >
              <Text>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={this.context.signInWithFacebook}
            >
              <View style={styles.button}>
                <Text style={styles.facebookText}>Continue with Facebook</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={this.context.signInWithGoogle}
            >
              <View style={styles.googleButton}>
                <Text style={styles.googleText}>Continue with Google</Text>
              </View>
            </TouchableOpacity>
            <View>
              <Text
                style={styles.text}
                onPress={() => {
                  this.props.navigation.navigate("SignUp");
                }}
              >
                Don't have an Account?
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  signIn: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3A559F",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  continueButton: {
    width: "80%",
    marginTop: 5,
    marginBottom: 10,
  },
  facebookText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  googleText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#303030",
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
});
export default SignInScreen;
