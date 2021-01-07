/*
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
import HomeBusinessNavigator from "./app/Components/HomeBusinessNavigator.js";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthNavigator,
      App: TabNavigator,
      AppBusiness: HomeBusinessNavigator,
      // App: CalendarApp,
      //SignIn: SignIn,
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
*/


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
        //var news = {};
        //news["30/12/2020 11:36"] = [{title: "New activity in town" ,text: "I'm a new vet in town , in my GPaw profile you can find all the info about me. "}];
        //db.addAdoptableAnimal('yghuiow','juiay','Willy',11,'Labrador','Medium','willy.jpg','profile');
        //db.addAdoptableAnimalDisease('yghuiow','juiay','disease1');
        //db.addAnimalDisease('axr4185','juiay','disease2');
        //db.addAnimalStat('axr4185','juiay','weight',20);
        //db.addAnimalStat('axr4185','juiay','height',50);
        //db.addAnimalStat('axr4185','juiay','weight',21);
        //db.addUserAnimal('axr4185','juioo','Willy',11,'Labrador','Medium','willy.jpg');
        //db.deleteAnimal('axr4185','juioo');
        //db.addUserFeed('axr4185','yyyhgd','Labrador needs extra hugs','Labrador are extremely emphatic dogs, needs constantly kindness and love');
        db.deleteUserFeed('axr4185','yyyhgd');
        //db.deleteAdoptableAnimalPlace('yghuiow','juiay');
    }

    const getUser = async() => {


        //db.addUserNotification('axr4185','yyyhgd','lost pet seen','Your lost pet has been found');
        db.addPlace('yyyuio','Kennel of MonteSanVito','kennel','kennel for abandoned pets','img.jpg','axr4185',132.65,133.68,0.5,0.5);
        db.addNews('yyyuio','kiyr','New adoptable dogs','Hi pet lovers, new adoptable dogs are looking for kind people, please take a look!');
   /*
        db.getUserNotifications('axr4185').then(function(notifications){
                   console.log(notifications);
        });

        db.getUserNotification('axr4185','yyyhgd').then(function(notification){
                           console.log(notification);
        });
        console.log("delete");
        db.deleteUserNotification('axr4185','yyyhgd');
        db.getUserNotification('axr4185','yyyhgd').then(function(notification){
                                   console.log(notification);
        });

         db.getAnimalStats('axr4185','juiay').then(function(place){
                     console.log(place);
         });*/
    }

   return (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Button title="Pick an image from camera roll" onPress={getUser} />
       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
       <Button title="Open the camera" onPress={addUser} />
     </View>
   );
 }



