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

class ReportLossForm extends Component {
  static contextType = AuthContext;
  state = {
    notes: null,
    place: null,
    email: null,
    telephone: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  handleValidation() {
    let errors = {};
    errors["name"] = null;
    errors["photo"] = null;
    errors["age"] = null;
    let formIsValid = true;
    //Name
    if (this.state.name == "") {
      formIsValid = false;
      errors["name"] = "Name cannot be empty";
    } else {
      if (!this.state.name.match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["name"] = "Only letters in name";
      }
    }

    //Photo
    if (this.state.photo == null) {
      formIsValid = false;
      errors["photo"] = "You must load a photo";
    }

    //Age

    if (this.state.age == "") {
      formIsValid = false;
      errors["age"] = "Age cannot be empty";
    } else {
      if (isNaN(this.state.age)) {
        formIsValid = false;
        errors["age"] = "Age must be a number";
      } else {
        if (
          this.state.age > 20 ||
          this.state.age < 0 ||
          !Number.isInteger(Number(this.state.age))
        ) {
          console.log(this.state.age > 20);
          console.log(this.state.age < 0);
          console.log(!Number.isInteger(this.state.age));
          formIsValid = false;
          errors["age"] = "Age is an integer between 0 and 20 ";
        }
      }
    }
    //console.log(errors);
    this.setState({ errors: errors });
    return formIsValid;
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  reportLoss = () => {
    const pet = this.props.pet;
    console.log("pet");
    console.log(this.context.uid);
    dbLostPet
      .addLostPetNotify(
        pet.getName(),
        pet.getPhoto(),
        pet.getSize(),
        pet.getColor(),
        pet.getBreed(),
        this.state.notes,
        this.state.place,
        this.context.uid,
        this.state.email,
        this.state.telephone
      )
      .then(() => {
        this.props.close();
      });
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.close();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Report Loss</Text>
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
                  value={this.state.telephone}
                  onChangeText={(telephone) => this.setState({ telephone })}
                />
              </View>

              <TouchableOpacity
                style={{
                  width: "50%",
                  marginTop: 10,
                  marginBottom: 40,
                  alignSelf: "center",
                }}
                onPress={this.reportLoss.bind(this)}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Report Loss</Text>
                </View>
              </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ReportLossForm;
