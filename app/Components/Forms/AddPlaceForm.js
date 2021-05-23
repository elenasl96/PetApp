import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import dbPlace from "../../firebase/Database/Functions/dbPlace";
import storageManager from "../../firebase/Storage/storage";
import PhotoBox from "../Custom/PhotoBox";
import { AuthContext } from "../AuthContext";

import mainStyle from "../../styles/mainStyle";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import constants from "../../shared/constants";
import validator from "../../shared/validation";

export default class AddPlaceForm extends React.Component {
  static contextType = AuthContext;
  state = {
    name: "",
    type: "Veterinary",
    description: "",
    photo: null,
    address: "",
    city: "",
    errors: {}, //dict
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  setPhoto = (photo) => {
    if (this.state.mounted) {
      this.setState({ photo: photo });
    }
  };

  async registerPlace() {
    let errors = validator.handlePlaceValidation(
      this.state.name,
      this.state.description,
      this.state.photo,
      this.state.address,
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
      const response = await fetch(this.state.photo);
      const file = await response.blob();
      Location.geocodeAsync(this.state.address).then((coordinates) => {
        console.log("latitude");
        console.log(coordinates[0].latitude);

        storageManager
          .toStorage(this.context.uid, file, "places")
          .then((url) => {
            dbPlace
              .addPlace(
                this.state.name,
                this.state.type,
                this.state.description,
                url,
                this.state.address + ", " + this.state.city,
                coordinates[0].latitude,
                coordinates[0].longitude,
                "latitudeDelta",
                "longitudeDelta"
              )
              .then((doc) => {
                this.context.addPlace(doc.id);
                dbPlace.addUserPlace(this.context.uid, doc.id);
                //Update global places to update map
                this.context.globalPlaces.push(doc.id);
                this.context.saveGlobalPlaces(this.context.globalPlaces);

                this.props.close();
              });
          });
      });
    }
  }

  render() {
    let types = constants.TYPES_PLACES.map((s, i) => {
      return <Picker.Item key={i} value={s} label={s} />;
    });

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
              <Text style={styles.title}>Add new place</Text>
              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.type}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({ type: itemValue })
                  }
                >
                  {types}
                </Picker>
              </View>
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

              {this.state.errors["name"] != null ? (
                <Text style={styles.error}>{this.state.errors["name"]}</Text>
              ) : null}

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Description"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  multiline
                  value={this.state.description}
                  onChangeText={(description) => this.setState({ description })}
                />
              </View>

              {this.state.errors["description"] != null ? (
                <Text style={styles.error}>
                  {this.state.errors["description"]}
                </Text>
              ) : null}

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Via, Street..."
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  textContentType="addressCity"
                  value={this.state.address}
                  onChangeText={(address) => this.setState({ address })}
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

              {this.state.errors["address"] != null ? (
                <Text style={styles.error}>{this.state.errors["address"]}</Text>
              ) : null}

              <PhotoBox setPhoto={this.setPhoto} isUpdate={false}></PhotoBox>
              {this.state.errors["photo"] != null ? (
                <Text style={styles.error}>{this.state.errors["photo"]}</Text>
              ) : null}

              <TouchableOpacity
                style={{
                  width: "50%",
                  marginTop: 10,
                  marginBottom: 40,
                  alignSelf: "center",
                }}
                onPress={this.registerPlace.bind(this)}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Register Place</Text>
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
    width: "80%",
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
