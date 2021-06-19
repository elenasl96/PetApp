import React from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { AuthContext } from "./ContextProvider";
import storageManager from "../../firebase/storage/Storage";
import dbUserAnimal from "../../firebase/database/functions/DbUserAnimal";
import dbPlace from "../../firebase/database/functions/DbPlace";
import dbUser from "../../firebase/database/functions/DbUser";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";
import validator from "../../shared/Validation";
import mainStyle from "../../styles/MainStyle";

class PhotoBox extends React.Component {
  // props: ids , section , initial photo (if any) , boolean to show (or not) update button

  // form includes this component asking to show ( or not to show) update button, initial photo and ids are passed just for the update.

  // if update is enabled the image picked should go to updatephoto and to the container
  // if not update the picked should be passed to the container with a set photo.

  //errors are handled for the update only

  state = {
    //photo: null,   // photo container
    photoUpdate: null, // local photo ( the one potentially used to update)
    mounted: false,
    visible: false,
    errors: {},
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    if (this.props.isUpdate) {
      this.setState({ photo: this.props.photo, visible: this.props.visible }); // photo passed from the container, our initial photo
    } else {
      this.setState({ visible: true });
    }
  }

  // method to pick images from gallery
  pickImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need gallery roll permissions to make this work!");
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        if (this.props.isUpdate) {
          if (this.state.mounted) {
            this.setPhotoUpdate(result.uri);
          }
        } else {
          this.props.setPhoto(result.uri);
          if (this.state.mounted) {
            this.setState({ photoUpdate: result.uri });
          }
        }
      }
    }
  };

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  // method to open the camera
  openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    } else {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        if (this.props.isUpdate) {
          if (this.state.mounted) {
            this.setPhotoUpdate(result.uri);
          }
        } else {
          this.props.setPhoto(result.uri);
          if (this.state.mounted) {
            this.setState({ photoUpdate: result.uri });
          }
        }
      }
    }
  };

  updatePhoto = async () => {
    const photoUpdate = this.state.photoUpdate;
    const photo = this.state.photo;
    let errors = validator.handlePhotoValidation(this.state.photoUpdate);
    let isValid = validator.isValid(errors);
    if (isValid) {
      storageManager.deleteFile(photo); // deletes old photo from storage
      this.upload(photoUpdate);
    }

    if (this.state.mounted) {
      this.setState({ errors: errors });
    }
  };

  setPhotoUpdate = (photo) => {
    let errors = {};
    if (this.state.mounted) {
      this.setState({ photoUpdate: photo });
      this.setState({ errors: errors }); //clean errors
    }
  };

  upload = async (uri) => {
    // logic to differentiate the storages
    const section = this.props.section;
    const uid = this.context.uid;
    if (section == "pets") {
      const petID = this.props.petID;
      const response = await fetch(uri);
      const file = await response.blob();
      storageManager.toStorage(uid, file, section).then((url) => {
        dbUserAnimal.updatePetPhoto(uid, petID, url); // update ref in db
        if (this.state.mounted) {
          this.setState({ photo: url });
        }
        this.props.setPhoto(url);
        this.props.close();
      });
    }

    if (section == "places") {
      const pid = this.props.pid;
      const response = await fetch(uri);
      const file = await response.blob();
      storageManager.toStorage(uid, file, section).then((url) => {
        dbPlace.updatePlacePhoto(pid, url); // update ref in db
        if (this.state.mounted) {
          this.setState({ photo: url });
        }
        this.props.setPhoto(url);
        this.props.close();
      });
    }

    if (section == "kennelpets") {
      const pid = this.props.pid;
      const petID = this.props.petID;
      const response = await fetch(uri);
      const file = await response.blob();
      storageManager.toStorage(uid, file, section).then((url) => {
        dbAdoptableAnimal.updateAdoptablePetPhoto(pid, petID, url); // update ref in db
        if (this.state.mounted) {
          this.setState({ photo: url });
        }
        this.props.setPhoto(url);
        this.props.close();
      });
    }

    if (section == "user") {
      const uid = this.context.uid;
      const response = await fetch(uri);
      const file = await response.blob();
      storageManager.toStorage(uid, file, section).then((url) => {
        dbUser.updateUserPhoto(pid, url); // update ref in db
        if (this.state.mounted) {
          this.setState({ photo: url });
        }
        this.props.setPhoto(url);
        this.props.close();
      });
    }
  };

  render() {
    const photoUpdate = this.state.photoUpdate;
    const photo = this.state.photo;

    if (this.props.isUpdate) {
      return (
        // Mode update

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
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity onPress={this.pickImage.bind(this)}>
                    <View style={styles.button}>
                      <Text> Pick image from gallery </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={this.openCamera.bind(this)}>
                    <View style={styles.button}>
                      <Text>Open the camera </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              <ScrollView
                horizontal={false}
                showsHorizontalScrollIndicator={false}
              >
                {photoUpdate != null ? (
                  <View>
                    <Image source={{ uri: photoUpdate }} style={styles.image} />
                  </View>
                ) : (
                  <View style={styles.image}></View>
                )}

                <TouchableHighlight
                  style={styles.petButton}
                  onPress={this.updatePhoto.bind(this)}
                  underlayColor={"rgb(200,200,200)"}
                >
                  <View style>
                    <Text>Update photo</Text>
                  </View>
                </TouchableHighlight>

                {this.state.errors["photo"] != null ? (
                  <Text style={styles.error}>{this.state.errors["photo"]}</Text>
                ) : null}
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
    } else {
      // Mode form
      return (
        <View
          style={[
            mainStyle.box,
            {
              flex: 1,
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "center",
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={this.pickImage.bind(this)}>
              <View style={styles.button}>
                <Text style={styles.text}> Pick image from gallery </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>OR</Text>

            <TouchableOpacity onPress={this.openCamera.bind(this)}>
              <View style={styles.button}>
                <Text style={styles.text}>Open the camera </Text>
              </View>
            </TouchableOpacity>
          </View>
          {photoUpdate != null ? (
            <View>
              <Image source={{ uri: photoUpdate }} style={styles.image} />
            </View>
          ) : (
            <View style={styles.image}></View>
          )}

          {this.props.isUpdate ? (
            <TouchableHighlight
              style={styles.petButton}
              onPress={this.updatePhoto.bind(this)}
              underlayColor={"rgb(200,200,200)"}
            >
              <View style>
                <Text>Update photo</Text>
              </View>
            </TouchableHighlight>
          ) : null}

          {this.state.errors["photo"] != null ? (
            <Text style={styles.error}>{this.state.errors["photo"]}</Text>
          ) : null}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  image: {
    width: 120,
    height: 120,
    backgroundColor: "lightgrey",
    borderRadius: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: {
    flex: 1,
  },
  text: {
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 0,
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
    padding: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingBottom: 10,
  },
  petButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
    elevation: 2,
    marginHorizontal: 5,
    width: 70,
    height: 30,
  },
  button: {
    backgroundColor: "white",
    minWidth: 100,
    //height: 44,
    borderRadius: 22,
    padding: 10,
    marginVertical: 5,
    marginRight: 10,
    alignContent: "center",
    justifyContent: "center",
    elevation: 2,
  },
  buttonText: {
    alignSelf: "center",
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  petContainer: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
  },
  pet: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "white",
    marginLeft: 10,
  },
  petImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
    padding: 10,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F9C74F",
    borderRadius: 20,
    marginLeft: 7,
    marginRight: 5,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },

  descriptionContainer: {
    padding: 10,
  },
  myPlaces: {
    flexWrap: "nowrap",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
    marginLeft: 15,
    width: 300,
    height: 150,
    borderRadius: 35,
    backgroundColor: "lightgreen",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 100,
    right: 100,
    height: 70,
    alignItems: "center",
  },
  mainButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    tintColor: "orange",
  },
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
});

export default PhotoBox;
