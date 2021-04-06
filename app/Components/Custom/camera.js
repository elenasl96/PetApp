import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import storage from "../../firebase/Storage/storage";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from 'expo-media-library';

export default function ImagePickerExample({ setPhoto }) {
  const [image, setImage] = useState(null);

  // method to pick images from gallery
  const pickImage = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need gallery roll permissions to make this work!");
    }
    else {
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
      let filename = upload(result.uri);
      console.log("photourl:" + filename);
    }
    }
  };

  // method to open the camera
  const openCamera = async () => {

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    else{
    console.log("Camera permissions granted");
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      console.log("Open camera");

      let filename = upload(result.uri);
    }
  }
  };

  const upload = async (uri) => {
    const response = await fetch(uri);
    const file = await response.blob();
    console.log("File");
    storage.toStorage("uid", file).then((url) => {
      console.log("tostore: " + url);
      setPhoto(url);
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
      }}
    >
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ marginTop: 15, width: 200, height: 200 }}
        />
      )}
      { <Button title="Open the camera" onPress={openCamera} /> }
    </View>
  );
}
