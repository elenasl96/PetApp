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
  ScrollView,
  Image,
} from "react-native";
import { auth } from "../firebase/firebaseconfig.js";
import "firebase/firestore";
import * as Facebook from "expo-facebook";
import dbUser from "../firebase/Database/Functions/dbUser";
import mainStyle from "../styles/mainStyle";
import { AuthContext } from "../Components/AuthContext";

class SignInScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    email: null,
    password: null,
    errorMessage: null,
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
      this.setState({ errorMessage: errorMessage, loading: false });
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
          dbUser.getUser(credential.user.uid).then((userFromDb) => {
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
        if (facebookProfileData.additionalUserInfo.isNewUser) {
          dbUser
            .addUser(
              auth().currentUser.uid,
              facebookProfileData.additionalUserInfo.profile.name,
              facebookProfileData.additionalUserInfo.profile.picture.data.url,
              this.state.type,
              this.state.address
            )
            .then("User Registered");
        }

        dbUser.getUser(user.uid).then((userFromDb) => {
          this.context.saveUser(userFromDb);
        });
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
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
          <ScrollView>
            <KeyboardAvoidingView
              style={mainStyle.container}
              //behavior={Platform.OS == "ios" ? "padding" : "height"}
              //keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
              //enabled={Platform.OS === "ios" ? true : false}
            >
              <Image
                style={mainStyle.logo}
                source={require("../../assets/images/logo/logo2.png")}
              ></Image>
              <View style={mainStyle.form}>
                <TextInput
                  testID="SignIn.emailInput"
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
                  testID="SignIn.passwordInput"
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
              <Text style={mainStyle.error}>{this.state.errorMessage}</Text>
              <TouchableOpacity
                testID="SignIn.Button"
                onPress={this.signInWithEmail.bind(this)}
              >
                <View style={[styles.button, styles.emailButton]}>
                  <Text style={styles.text}>Sign In with email</Text>
                </View>
              </TouchableOpacity>

              <Text style={{ marginVertical: 10 }}>OR</Text>

              <TouchableOpacity onPress={this.signInWithFacebook.bind(this)}>
                <View style={[styles.button, styles.facebookButton]}>
                  <Text style={styles.lightText}>Continue with Facebook</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
              // onPress={this.context.signInWithGoogle}
              >
                <View style={[styles.button, styles.googleButton]}>
                  <Text style={styles.lightText}>Continue with Google</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.linkBox, mainStyle.link]}>
                <Text
                  testID="SignIn.ToSignUp"
                  style={styles.text}
                  onPress={() => {
                    this.props.navigation.navigate("SignUp");
                  }}
                >
                  Don't have an Account?
                </Text>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
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
    maxWidth: 300,
    width: "95%",
    marginTop: 15,
    borderRadius: 50,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
    padding: 20,
    elevation: 4,
  },
  continueButton: {
    width: "80%",
    marginTop: 5,
    marginBottom: 10,
  },
  lightText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  googleText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#303030",
  },
  emailButton: {
    backgroundColor: "#FFFFFF",
  },
  facebookButton: {
    backgroundColor: "#1d3557",
  },
  googleButton: {
    backgroundColor: "#e63946",
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  linkBox: {
    marginTop: 20,
    marginBottom: 50,
  },
});
export default SignInScreen;
