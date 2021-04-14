import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

export default function ImagePickerExample({ setPhoto }) {
  const [image, setImage] = useState(null);

  // method to pick images from gallery
  const pickImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need gallery roll permissions to make this work!");
    } else {
      console.log("Gallery permissions granted");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
        //let filename = upload(result.uri);
        console.log("photourl:" + filename);
      }
    }
  };

  // method to open the camera
  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    } else {
      console.log("Camera permissions granted");
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        console.log(result.uri);
        console.log("Open camera");
        setPhoto(result.uri);
        //let filename = upload(result.uri);
      }
    }
  };
  /*
  const upload = async (uri) => {
    const response = await fetch(uri);
    const file = await response.blob();
    console.log("File");
    storage.toStorage("uid", file, "images").then((url) => {
      console.log("tostore: " + url);
      setPhoto(url);
    });
  };
  */
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "center",
      }}
    >
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.button}>
            <Text> Pick image from gallery </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={openCamera}>
          <View style={styles.button}>
            <Text>Open the camera </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        {(image && <Image source={{ uri: image }} style={styles.image} />) || (
          <View style={styles.image}></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "powderblue",
    padding: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    marginVertical: 5,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: "lightgrey",
    borderRadius: 20,
  },
});
