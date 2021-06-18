import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import dbUserAnimal from "../../firebase/database/functions/DbUserAnimal";
import storageManager from "../../firebase/storage/Storage";
import PhotoBox from "../custom/PhotoBox";
import { AuthContext } from "../custom/AuthContext";
import { withNavigation } from "react-navigation";
import { Picker } from "@react-native-picker/picker";
import constants from "../../shared/Constants";
import validator from "../../shared/Validation";
import mainStyle from "../../styles/MainStyle";
import { ScrollView } from "react-native-gesture-handler";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";

class AddPetForm extends React.Component {
  static contextType = AuthContext;
  state = {
    name: "",
    age: "",
    photo: null,
    url: null,
    typeSelected: "Dog",
    prevTypeSelected: "Dog",
    breedSelected: "None",
    colorSelected: "Apricot",
    sizeSelected: "Small",
    profile: null,
    errors: {}, // dict
    visible: false,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    if (this.state.mounted) {
      this.setState({ visible: this.props.visible });
    }
  }

  registerPet = async () => {
    let errors = validator.handlePetValidation(
      this.state.name,
      this.state.age,
      this.state.photo,
      this.props.adoptable,
      this.state.profile
    );
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });

    if (isValid) {
      const response = await fetch(this.state.photo);
      const file = await response.blob();
      storageManager.toStorage(this.context.uid, file, "pets").then((url) => {
        if (this.props.adoptable) {
          dbAdoptableAnimal
            .addAdoptableAnimal(
              this.props.pid,
              this.state.name,
              this.state.age,
              this.state.breedSelected,
              this.state.sizeSelected,
              this.state.colorSelected,
              url,
              this.state.typeSelected,
              this.state.profile
            )
            .then((doc) => {
              this.context.addAdoptablePet(this.props.pid, doc.id);
              this.props.close();
            });
        } else {
          dbUserAnimal
            .addUserAnimal(
              this.context.uid,
              this.state.name,
              this.state.age,
              this.state.breedSelected,
              this.state.sizeSelected,
              this.state.colorSelected,
              url,
              this.state.typeSelected
            )
            .then((doc) => {
              //this.props.addPet(doc.id);
              this.context.addPet(doc.id);
              dbUserAnimal.addAnimalStat(this.context.uid, doc.id, "weight");
              dbUserAnimal.addAnimalStat(this.context.uid, doc.id, "height");
              this.props.close();
            });
        }
      });
    }
  };

  setPhoto = (photo) => {
    if (this.state.mounted) {
      this.setState({ photo: photo });
    }
  };

  componentDidUpdate() {
    if (this.state.prevTypeSelected != this.state.typeSelected) {
      this.state.breedSelected = "None";
      this.state.prevTypeSelected = this.state.typeSelected;
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

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
              <Text style={styles.title}>+ Pet </Text>
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
              {this.state.errors["name"] != null ? (
                <Text style={styles.error}>{this.state.errors["name"]}</Text>
              ) : null}

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Age"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  value={this.state.age}
                  onChangeText={(age) => this.setState({ age })}
                />
              </View>

              {this.state.errors["age"] != null ? (
                <Text style={styles.error}>{this.state.errors["age"]}</Text>
              ) : null}

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

              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.colorSelected}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(color) =>
                    this.setState({ colorSelected: color })
                  }
                >
                  {colors}
                </Picker>
              </View>

              <View style={mainStyle.form}>
                <Picker
                  selectedValue={this.state.sizeSelected}
                  style={{ height: 50, width: "100%" }}
                  onValueChange={(size) =>
                    this.setState({ sizeSelected: size })
                  }
                >
                  {sizes}
                </Picker>
              </View>

              {this.props.adoptable ? (
                <View style={mainStyle.form}>
                  <TextInput
                    style={mainStyle.inputText}
                    placeholder="Profile"
                    placeholderTextColor="#616161"
                    returnKeyType="next"
                    value={this.state.profile}
                    onChangeText={(profile) => this.setState({ profile })}
                  />
                </View>
              ) : null}

              {this.state.errors["profile"] != null ? (
                <Text style={styles.error}>{this.state.errors["profile"]}</Text>
              ) : null}

              <PhotoBox
                setPhoto={this.setPhoto}
                section={"pets"}
                isUpdate={false}
              ></PhotoBox>

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
                onPress={this.registerPet.bind(this)}
              >
                <View style={mainStyle.submitButton}>
                  <Text style={styles.buttonText}>Register Pet</Text>
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
});

export default withNavigation(AddPetForm);
