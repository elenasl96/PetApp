import React, { Component } from "react";
import firebase from "firebase";
import * as Facebook from "expo-facebook";
import * as GoogleSignIn from "expo-google-sign-in";
//import dbUser from "../firebase/Database/Functions/dbUser";

export const AuthContext = React.createContext();

class AuthContextProvider extends Component {
  state = {
    user: null,
    loading: false,
    uid: "",
    places: null,
    savedPlaces: null,
    //lastlogin:"",
    //   pets: [],
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  saveUserUID = (uid) => {
    if (this.state.mounted) {
      this.setState({ uid: uid });
    }
    //console.log("this state uid:" + this.state.uid);
  };

  saveUser = (user) => {
    if (this.state.mounted) {
      this.setState({ user: user });
    }
    //console.log("this user");
    //console.log(this.state.user);
  };

  savePlaces = (places) => {
    if (this.state.mounted) {
      this.setState({ places: places });
    }
  };

  saveFavouritePlaces = (places) => {
    if (this.state.mounted) {
      this.setState({ savedPlaces: places });
    }
  };

  /*
  saveLastLogin = (lastlogin) => {
   this.setState({lastlogin: lastlogin});
   console.log("lastlogin:" + this.state.lastlogin);
  }  */

  /*
  savePet = (pet) => {
    this.state.pets.push(pet);
    console.log("pets in context:");
    console.log(this.state.pets);
  };
*/
  onLoginSuccess() {
    this.props.navigation.navigate("App");
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
          savePlaces: this.savePlaces,
          saveFavouritePlaces: this.saveFavouritePlaces,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContextProvider;
