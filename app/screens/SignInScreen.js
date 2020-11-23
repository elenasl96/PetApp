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
  Keyboard
} from "react-native";
import "firebase/firestore";
import firebase from "firebase";
import * as Facebook from 'expo-facebook'
import * as GoogleSignIn from 'expo-google-sign-in'
import mainStyle from "../styles/mainStyle";

class SignInScreen extends React.Component {
  state = { email: '', password: '', errorMessage: '', loading: false };  
  onLoginSuccess() {
    this.props.navigation.navigate('App');
  }  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false });
  }  renderLoading() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
  }  async signInWithEmail() {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.onLoginSuccess.bind(this))
      .catch(error => {
          let errorCode = error.code;
          let errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak Password!');
          } else {
              this.onLoginFailure.bind(this)(errorMessage);
          }
      });
  }  async signInWithFacebook() {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('684399708713036', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInWithCredential(credential);
        this.onLoginSuccess.bind(this)
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }  async signInWithGoogle() {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      const data = await GoogleSignIn.GoogleAuthentication.prototype.toJSON();
      if (type === 'success') {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
        const googleProfileData = await firebase.auth().signInWithCredential(credential);
        this.onLoginSuccess.bind(this);
      }
    } catch ({ message }) {
      alert('login: Error:' + message);
    }
  }  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.logo}>
              PetApp    
            </Text>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#B1B1B1"
                returnKeyType="next"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </View>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#B1B1B1"
                returnKeyType="done"
                textContentType="newPassword"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </View>
            {this.renderLoading()}
            <Text style={mainStyle.error}>
              {this.state.error}
            </Text>
            <TouchableOpacity
              style={{ width: '86%', marginTop: 10 }}
              onPress={() => this.signInWithEmail()}>
                  <Text>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: "86%", marginTop: 10 }}
              onPress={() => this.signInWithFacebook()}>
              <View style={styles.button}>
                <Text
                  style={{
                    letterSpacing: 0.5,
                    fontSize: 16,
                    color: "#FFFFFF"
                  }}
                >
                  Continue with Facebook
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ width: "86%", marginTop: 10 }}
              onPress={() => this.signInWithGoogle()}>
              <View style={styles.googleButton}>
                <Text
                  style={{
                    letterSpacing: 0.5,
                    fontSize: 16,
                    color: "#707070"
                  }}
                >
                  Continue with Google
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 10 }}>
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
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    width: "86%",
    marginTop: 15,
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  logo: {
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  input: {
    height:50,
    color:"white"
  },
  button: {
    backgroundColor: "#3A559F",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#707070"
  },
});export default SignInScreen;