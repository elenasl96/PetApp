import React, { Component } from "react";
import firebase from "firebase";
import * as Facebook from "expo-facebook";
import * as GoogleSignIn from "expo-google-sign-in";
import db from "../firebase/DatabaseManager";

export const AuthContext = React.createContext();

class AuthContextProvider extends Component {
  state = {
    user: null,
    loading: false,
    uid: "",
  };

  saveUserUID = (uid) => {
    this.setState({ uid: uid });
    console.log("this state uid:" + this.state.uid);
  };

  saveUser = (user) => {
    this.setState({ user: user });
    console.log("this user");
    console.log(this.state.user);
  };

  onLoginSuccess() {
    this.props.navigation.navigate("App");
  }

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false });
  }

  async signInWithEmail(state) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(this.onLoginSuccess.bind(this))
      .then(console.log(state))
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          //this.onLoginFailure.bind(this)("Weak Password!");
        } else {
          this.onLoginFailure.bind(this)(errorMessage);
        }
      });
  }

  async signInWithGoogle() {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      const data = await GoogleSignIn.GoogleAuthentication.prototype.toJSON();
      if (type === "success") {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          data.accessToken
        );
        const googleProfileData = await firebase
          .auth()
          .signInWithCredential(credential);
        //this.onLoginSuccess.bind(this);
      }
    } catch ({ message }) {
      alert("login: Error:" + message);
    }
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          ...this.state,
          signInWithEmail: this.signInWithEmail,
          signInWithGoogle: this.signInWithGoogle,
          saveUserUID: this.saveUserUID,
          saveUser: this.saveUser,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContextProvider;
