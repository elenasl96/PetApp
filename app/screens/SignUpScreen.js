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
import PhotoBox from "../Components/Custom/PhotoBox";
import mainStyle from "../styles/mainStyle";
import dbUser from "../firebase/Database/Functions/dbUser";
import { AuthContext } from "../Components/AuthContext.js";
import { Picker } from "@react-native-picker/picker";

class SignUpScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    name: null,
    email: null,
    password: null,
    address: null,
    type: null,
    photo: null,
    errorMessage: null,
    loading: false,
    mounted: true,
    emailSignup: false,
    facebookSignup: false,
    googleSignup: false,
  };

   componentDidMount(){
      this.setState({mounted:true});
    }

    componentWillUnmount(){
      this.setState({mounted:false});
    }


  onLoginFailure(errorMessage) {
    if (this.state.mounted) {
      this.setState({ errorMessage: errorMessage, loading: false });
    }
  }

  setPhoto = (photo) => {
    if (this.state.mounted) {
      this.setState({ photo: photo });
    }
  };

  async signUpWithEmail() {
    if (this.state.emailSignup) {
      console.log(this.state);
      if (
        this.state.name &&
        this.state.email &&
        this.state.password &&
        this.state.address &&
        this.state.type &&
        this.state.type !== "" &&
        this.state.photo
      ) {
        await auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((credential) => {
            let user = credential.user;
            //console.log(user);
            dbUser
              .addUser(
                user.uid,
                this.state.name,
                this.state.photo,
                this.state.type,
                this.state.address
              )
              .then(() => {
                //auth().setPersistence(auth.Auth.Persistence.LOCAL);
                //this.props.navigation.navigate("App");
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
    } else {
      if (this.state.mounted) {
        this.setState({
          emailSignup: true,
          facebookSignup: false,
          googleSignup: false,
          errorMessage: null,
        });
      }
    }
  }

  async signInWithFacebook() {
    if (this.state.facebookSignup) {
      if (this.state.address && this.state.type) {
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

            //console.log("Facebook data:");
            //console.log(facebookProfileData);
            if (facebookProfileData.additionalUserInfo.isNewUser) {
              dbUser
                .addUser(
                  auth().currentUser.uid,
                  facebookProfileData.additionalUserInfo.profile.name,
                  facebookProfileData.additionalUserInfo.profile.picture.data
                    .url,
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
      } else {
        this.onLoginFailure.bind(this)("Fill all the fields");
      }
    } else {
      if (this.state.mounted) {
        this.setState({
          facebookSignup: true,
          emailSignup: false,
          googleSignup: false,
          errorMessage: null,
        });
      }
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
            {this.state.emailSignup ? (
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
            ) : null}

            {this.state.emailSignup ? (
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
            ) : null}

            {this.state.emailSignup ? (
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
            ) : null}

            {this.state.emailSignup ? (
              <PhotoBox setPhoto={this.setPhoto} isUpdate={false}></PhotoBox>
            ) : null}

            {this.state.emailSignup ||
            this.state.facebookSignup ||
            this.state.googleSignup ? (
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
            ) : null}

            {this.state.emailSignup ||
            this.state.facebookSignup ||
            this.state.googleSignup ? (
              <View style={mainStyle.form}>
                <Picker
                  selectedValue={""}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ type: itemValue })
                  }
                >
                  <Picker.Item label="Select user type" value="" />
                  <Picker.Item label="Basic user" value="user" />
                  <Picker.Item label="Business user" value="businessUser" />
                </Picker>
              </View>
            ) : null}

            {this.renderLoading()}
            <Text style={styles.error}>{this.state.errorMessage}</Text>
            <TouchableOpacity
              style={{ width: "80%", marginVertical: 8 }}
              onPress={this.signUpWithEmail.bind(this)}
            >
              <View style={styles.emailButton}>
                <Text style={styles.text}>Sign Up with email</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "80%", marginVertical: 8 }}
              onPress={this.signInWithFacebook.bind(this)}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Signup with Facebook</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "80%", marginVertical: 8 }}
              onPress={this.context.signInWithGoogle}
            >
              <View style={styles.googleButton}>
                <Text style={styles.buttonText}>Signup with Google</Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 10 }}>
              <Text
                style={styles.text}
                onPress={() => {
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
    backgroundColor: "rgb(255, 50, 50)",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#707070",
  },
  emailButton: {
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
