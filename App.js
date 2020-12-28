import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import * as firebase from "firebase";
import firebaseConfig from "./app/firebase/firebaseconfig.js";
import db from "./app/firebase/DatabaseManager.js";

import AuthNavigator from "./app/Components/AuthNavigator";
import SignIn from "./app/screens/SignInScreen";
import * as Notifications from "expo-notifications";
import TabNavigator from "./app/Components/TabNavigator.js";
import AuthContextProvider from "./app/Components/AuthContext.js";
import ProtectedNavigator from "./app/Components/TabNavigator.js";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthNavigator,
      App: TabNavigator,
      // App: CalendarApp,
      SignIn: SignIn,
    },
    {
      initialRouteName: "Auth",
    }
  )
);

function App() {
  return (
    <AuthContextProvider>
      <AppContainer />
    </AuthContextProvider>
  );
}
export default App;
/*

import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import db from "./app/firebase/DatabaseManager.js";

export default function ImagePickerExample() {

   const [image, setImage] = useState(null);

// grant permissions
   useEffect(() => {
     (async () => {
       if (Platform.OS !== 'web') {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== 'granted') {
           alert('Sorry, we need camera roll permissions to make this work!');
         }
       }
     })();
   }, []);

// method to pick images from gallery
   const pickImage = async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
     console.log(result);

     if (!result.cancelled) {
       setImage(result.uri);
     }
   };

// method to open the camera
   const openCamera = async () => {
           let result = await ImagePicker.launchCameraAsync({
             mediaTypes: ImagePicker.MediaTypeOptions.All,
             allowsEditing: true,
             aspect: [4, 3],
             quality: 1,
           });
        console.log(result);
      if (!result.cancelled) {
             setImage(result.uri);
             upload(result.uri);
           }
    };

   const upload = async(uri) => {
        const response = await fetch(uri);
        const file = await response.blob();
        db.toStorage(file);
    }

    const addUser = async() => {
        //db.addUser('axr4183','matteo','matteo.jpg','user','via piave');
        var stats = {};
        stats["weight"] = [{date: '20-12-2020 10:34',value:  20 },{date: '28-12-2020 11:50',value: 20.3}];
        db.addUserAnimal('axr4183','1145888','Lola',10,'greyhound','medium','photo1298662',['Hepatitis','Leptospiroris'],stats);
    }

    const getUser = async() => {

        //var stats = {};
        //stats["weight"] = [{date: '20-12-2020 10:34',value:  20 },{date: '28-12-2020 11:50',value: 20.3}];
        //db.addAdoptableAnimal('axr4185','1145888','Lola',10,'greyhound','medium','photo1298662',['Hepatitis','Leptospiroris'],'Really sweet dog looking for a kind family');
        db.getUser('axr4183').then(function(user){
           console.log(user);
        });
    }

   return (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Button title="Pick an image from camera roll" onPress={pickImage} />
       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
       <Button title="Open the camera" onPress={getUser} />
     </View>
   );
 }
*/
