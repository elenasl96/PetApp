import React, { Component } from "react";
import firebase from "firebase";
import * as GoogleSignIn from "expo-google-sign-in";

export const AuthContext = React.createContext();

class AuthContextProvider extends Component {
  state = {
    user: null,
    loading: false,
    uid: "",
    places: [], //my places (for business)
    savedPlaces: [], //my saved places
    pets: [], //user pets
    adoptablePets: {}, // map place and adoptable pets
    lostPets: [],
    lostPetsSeen: [],
    globalPlaces: [],
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
  };

  saveUser = (user) => {
    if (this.state.mounted) {
      this.setState({ user: user });
    }
  };

  savePlaces = (places) => {
    if (this.state.mounted) {
      this.setState({ places: places });
    }
  };

  addPlace = (place) => {
    let places = this.state.places;
    places.push(place);
    this.savePlaces(places);
  };

  deletePlace = (place) => {
    let places = this.state.places;
    let index = places.indexOf(place);
    if (index != -1) {
      places.splice(index, 1);
    }
    this.savePlaces(places);
    this.saveAdoptablePets(place, null); // delete place from adoptable animals
  };

  saveFavouritePlaces = (places) => {
    if (this.state.mounted) {
      this.setState({ savedPlaces: places });
    }
  };

  addFavouritePlace = (place) => {
    let places = this.state.savedPlaces;
    places.push(place);
    this.saveFavouritePlaces(places);
  };

  deleteFavouritePlace = (place) => {
    let places = this.state.savedPlaces;
    let index = places.indexOf(place);
    if (index !== -1) {
      places.splice(index, 1);
    }

    this.saveFavouritePlaces(places);
  };

  savePets = (pets) => {
    if (this.state.mounted) {
      this.setState({ pets: pets });
    }
  };

  addPet = (pet) => {
    let pets = this.state.pets;
    pets.push(pet);
    this.savePets(pets);
  };

  deletePet = (pet) => {
    let pets = this.state.pets;
    let index = pets.indexOf(pet);
    if (index != -1) {
      pets.splice(index, 1);
    }
    this.savePets(pets);
  };

  saveAdoptablePets = (pid, pets) => {
    var adoptablePets = this.state.adoptablePets;
    if (pets == null) {
      adoptablePets[pid] = [];
    } else {
      adoptablePets[pid] = pets;
    }

    if (this.state.mounted) {
      this.setState({ adoptablePets, adoptablePets });
    }
  };

  addAdoptablePet = (pid, pet) => {
    let adoptablePets = this.state.adoptablePets;
    if (adoptablePets[pid] == null) {
      adoptablePets[pid] = [];
    }
    adoptablePets[pid].push(pet);
    let pets = adoptablePets[pid];
    this.saveAdoptablePets(pid, pets);
  };

  deleteAdoptablePet = (pid, pet) => {
    let pets = this.state.adoptablePets[pid];
    let index = pets.indexOf(pet);
    if (index != -1) {
      pets.splice(index, 1);
    }
    this.saveAdoptablePets(pid, pets);
    pets = this.state.adoptablePets[pid];
  };

  saveLostPets = (pets) => {
    if (this.state.mounted) {
      this.setState({ lostPets: pets });
    }
  };

  saveLostPetsSeen = (pets) => {
    if (this.state.mounted) {
      this.setState({ lostPetsSeen: pets });
    }
  };

  saveGlobalPlaces = (places) => {
    if (this.state.mounted) {
      this.setState({ globalPlaces: places });
    }
  };

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
          addPlace: this.addPlace,
          deletePlace: this.deletePlace,
          saveFavouritePlaces: this.saveFavouritePlaces,
          addFavouritePlace: this.addFavouritePlace,
          deleteFavouritePlace: this.deleteFavouritePlace,
          savePets: this.savePets,
          addPet: this.addPet,
          deletePet: this.deletePet,
          saveAdoptablePets: this.saveAdoptablePets,
          addAdoptablePet: this.addAdoptablePet,
          deleteAdoptablePet: this.deleteAdoptablePet,
          saveLostPets: this.saveLostPets,
          saveLostPetsSeen: this.saveLostPetsSeen,
          saveGlobalPlaces: this.saveGlobalPlaces,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthContextProvider;
