import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { AuthContext } from "../custom/ContextProvider";
import mainStyle from "../../styles/MainStyle";
import { ScrollView } from "react-native-gesture-handler";
import PhotoBox from "../custom/PhotoBox";
import { Picker } from "@react-native-picker/picker";
import constants from "../../shared/Constants";
import validator from "../../shared/Validation";
import LostPetNotify from "../../firebase/database/objects/LostPetNotify";
import PetLostButton from "../buttons/PetLostButton";
import LostPetSeen from "../../firebase/database/objects/LostPetSeen";
import NotifySightButton from "../buttons/NotifySightButton";
import * as Location from "expo-location";
import MainStyle from "../../styles/MainStyle";
import storageManager from "../../firebase/storage/Storage";

class ReportLossForm extends Component {
  static contextType = AuthContext;
  state = {
    name: "",
    photo: null,
    size: null,
    color: null,
    breed: "",
    notes: null,
    place: null,
    city: null,
    email: null,
    phone: null,
    mounted: false,
    errors: {},
    typeSelected: "Dog",
  };

  componentDidMount() {
    this.setState({ mounted: true });
    if (this.props.pet != null) {
      pet = this.props.pet;
      this.setState({
        name: pet.name,
        photo: pet.photo,
        size: pet.size,
        color: pet.color,
        breed: pet.breed,
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  closeModal = () => {
    this.setState({
      showPetsMatched: false,
    });
  };

  reportLoss = async () => {
    const pet = this.props.pet;
    let errors = validator.handleReportValidation(
      this.state.phone,
      "loss",
      this.state.name,
      this.state.place,
      this.state.city
    );
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });
    if (isValid) {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let place = this.state.place + ", " + this.state.city;
      let file = null;
      console.log(this.state.photo);
      if (this.state.photo && this.state.photo !== "") {
        const response = await fetch(this.state.photo);
        file = await response.blob();
      }
      storageManager.toStorage(this.context.uid, file, "pets").then((url) => {
        Location.geocodeAsync(place).then(async (coordinates) => {
          console.log("coordinates");
          console.log(coordinates);
          let lostPet = new LostPetNotify(
            this.state.name,
            url,
            this.state.size,
            this.state.color,
            this.state.breed,
            this.state.notes,
            place,
            "",
            this.context.uid,
            this.state.email,
            this.state.phone,
            coordinates[0].latitude,
            coordinates[0].longitude
          );
          this.props.sendForm(lostPet, false);
        });
      });
    }
  };

  reportSight = async () => {
    let errors = validator.handleReportValidation(
      this.state.phone,
      "seen",
      this.state.name,
      this.state.place,
      this.state.city
    );
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });
    if (isValid) {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let place = this.state.place + ", " + this.state.city;
      Location.geocodeAsync(place).then(async (coordinates) => {
        let file = null;
        console.log(this.state.photo);
        if (this.state.photo && this.state.photo !== "") {
          const response = await fetch(this.state.photo);
          file = await response.blob();
        }

        storageManager.toStorage(this.context.uid, file, "pets").then((url) => {
          console.log("coordinates");
          console.log(coordinates);
          let lostPet = new LostPetSeen(
            url,
            this.state.size,
            this.state.color,
            this.state.breed,
            this.state.notes,
            place,
            "",
            this.context.uid,
            this.state.email,
            this.state.phone,
            coordinates[0].latitude,
            coordinates[0].longitude
          );
          this.props.sendForm(lostPet, true);
        });
      });
    }
  };

  replyToLoss = () => {
    let errors = validator.handleReportValidation(this.state.phone);
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });
    if (isValid) {
      this.props.close();
      return new LostPetSeen(
        this.state.photo,
        this.state.size,
        this.state.color,
        this.state.breed,
        this.state.notes,
        this.state.place,
        "",
        this.props.pet.id,
        this.state.email,
        this.state.phone
      );
    }
    return null;
  };

  setPhoto = (photo) => {
    if (this.state.mounted) {
      this.setState({ photo: photo });
    }
  };

  render() {
    let types = constants.TYPES_PETS.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let breedsDog = constants.BREEDS_DOG.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let breedsCat = constants.BREEDS_CAT.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let colors = constants.COLORS_PETS.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let sizes = constants.SIZES_PETS.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

    let pet = this.props.pet;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.close();
        }}
      >
        <View style={mainStyle.centeredView}>
          <View style={mainStyle.modalView}>
            <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
            >
              {this.props.sight ? (
                <Text style={styles.title}>Report Sight</Text>
              ) : (
                <Text style={styles.title}>Report loss</Text>
              )}

              {this.props.pet == null && !this.props.sight ? (
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
              ) : null}
              {this.state.errors["name"] != null ? (
                <Text style={MainStyle.error}>{this.state.errors["name"]}</Text>
              ) : null}
              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <Picker
                    selectedValue={this.state.size}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(size) => this.setState({ size: size })}
                  >
                    {sizes}
                  </Picker>
                </View>
              ) : null}

              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <Picker
                    selectedValue={this.state.color}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(color) => this.setState({ color: color })}
                  >
                    {colors}
                  </Picker>
                </View>
              ) : null}
              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <Picker
                    selectedValue={this.state.typeSelected}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(type) =>
                      this.setState({ typeSelected: type })
                    }
                  >
                    {types}
                  </Picker>
                </View>
              ) : null}
              {this.props.pet == null ? (
                <View style={mainStyle.form}>
                  <Picker
                    selectedValue={this.state.breedSelected}
                    style={{ height: 50, width: "100%" }}
                    onValueChange={(breed) =>
                      this.setState({ breedSelected: breed })
                    }
                  >
                    {this.state.typeSelected == "Dog" ? breedsDog : breedsCat}
                  </Picker>
                </View>
              ) : null}
              {this.state.errors["breed"] != null ? (
                <Text style={MainStyle.error}>
                  {this.state.errors["breed"]}
                </Text>
              ) : null}
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Notes"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  value={this.state.notes}
                  onChangeText={(notes) => this.setState({ notes })}
                />
              </View>
              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Via, Street..."
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="addressCity"
                  value={this.state.place}
                  onChangeText={(place) => this.setState({ place })}
                />
              </View>

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="City"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="addressCity"
                  value={this.state.city}
                  onChangeText={(city) => this.setState({ city })}
                />
              </View>

              {this.state.errors["place"] != null ? (
                <Text style={MainStyle.error}>
                  {this.state.errors["place"]}
                </Text>
              ) : null}

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
                  placeholder="Telephone Number"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="telephoneNumber"
                  value={this.state.phone}
                  onChangeText={(phone) => this.setState({ phone })}
                />
              </View>
              {this.state.errors["number"] != null ? (
                <Text style={MainStyle.error}>
                  {this.state.errors["number"]}
                </Text>
              ) : null}

              {this.props.pet == null ? (
                <PhotoBox setPhoto={this.setPhoto} isUpdate={false}></PhotoBox>
              ) : null}

              {this.props.sight && pet == null ? (
                <TouchableOpacity
                  style={{
                    width: "50%",
                    marginTop: 10,
                    marginBottom: 40,
                    alignSelf: "center",
                  }}
                  onPress={this.reportSight.bind(this)}
                >
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Report sight </Text>
                  </View>
                </TouchableOpacity>
              ) : null}
              {!this.props.sight ? (
                <TouchableOpacity
                  style={{
                    width: "50%",
                    marginTop: 10,
                    marginBottom: 40,
                    alignSelf: "center",
                  }}
                  onPress={this.reportLoss.bind(this)}
                >
                  <View style={mainStyle.submitButton}>
                    <Text style={styles.buttonText}>Report Loss </Text>
                  </View>
                </TouchableOpacity>
              ) : null}

              {this.props.sight && pet !== null ? (
                <View style={styles.buttons}>
                  <NotifySightButton
                    navigation={this.props.navigation}
                    animal={pet}
                    userID={pet.uid}
                    replyToLoss={this.replyToLoss.bind(this)}
                  ></NotifySightButton>
                </View>
              ) : null}

              {this.state.showPetsMatched ? (
                <View>
                  <Text style={styles.title}>Matched Pets</Text>
                  <PetLostButton
                    navigation={this.props.navigation}
                    pets={this.state.lostPetsMatched}
                    closeModal={this.closeModal.bind(this)}
                  ></PetLostButton>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    width: "100%",
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

export default ReportLossForm;
