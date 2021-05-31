import React from "react";
import { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import dbLostPet from "../../firebase/Database/Functions/dbLostPet";
import { AuthContext } from "../AuthContext";
import { withNavigation } from "react-navigation";
import mainStyle from "../../styles/mainStyle";
import { ScrollView } from "react-native-gesture-handler";
import PhotoBox from "../Custom/PhotoBox";
import { Picker } from "@react-native-picker/picker";
import constants from "../../shared/constants";
import validator from "../../shared/validation";
import LostPetNotify from "../../firebase/Database/Objects/LostPetNotify";
import MatchPetsModal from "../Custom/matchPetsModal";
import PetLostButton from "../Buttons/PetLostButton";
import LostPetSeen from "../../firebase/Database/Objects/LostPetSeen";
import NotifySightButton from "../Buttons/NotifySightButton";

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

  reportLoss = () => {
    const pet = this.props.pet;
    let errors = validator.handleReportValidation(
      this.state.phone,
      "loss",
      this.state.name
    );
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });
    if (isValid) {
      let lostPet = new LostPetNotify(
        this.state.name,
        this.state.photo,
        this.state.size,
        this.state.color,
        this.state.breed,
        this.state.notes,
        this.state.place,
        "",
        "",
        this.state.email,
        this.state.phone
      );
      this.props.sendForm(lostPet, false);
    }
  };

  reportSight = () => {
    let errors = validator.handleReportValidation(this.state.phone);
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });
    if (isValid) {
      let lostPet = new LostPetSeen(
        this.state.photo,
        this.state.size,
        this.state.color,
        this.state.breed,
        this.state.notes,
        this.state.place,
        "",
        "",
        this.state.email,
        this.state.phone
      );
      this.props.sendForm(lostPet, true);
    }
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
              style={{ width: "80%" }}
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
                <Text style={styles.error}>{this.state.errors["name"]}</Text>
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
                <Text style={styles.error}>{this.state.errors["breed"]}</Text>
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
                  placeholder="Place"
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
                <Text style={styles.error}>{this.state.errors["number"]}</Text>
              ) : null}

              {this.props.pet == null ? (
                <PhotoBox setPhoto={this.setPhoto} isUpdate={false}></PhotoBox>
              ) : null}

              {this.props.sight ? (
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
                    <Text style={styles.buttonText}>Report sight</Text>
                  </View>
                </TouchableOpacity>
              ) : (
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
                    <Text style={styles.buttonText}>Report Loss</Text>
                  </View>
                </TouchableOpacity>
              )}

              {pet ? (
                <View style={styles.buttons}>
                  <NotifySightButton
                    navigation={this.props.navigation}
                    animal={pet}
                    userID={pet.uid}
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
