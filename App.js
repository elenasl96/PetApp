
import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import * as firebase from "firebase";
import firebaseConfig from "./app/firebase/firebaseconfig.js";
import db from "./app/firebase/DatabaseManager.js";

import AuthNavigator from "./app/Components/Navigators/AuthNavigator";
import SignIn from "./app/screens/SignInScreen";
import * as Notifications from "expo-notifications";
import TabNavigator from "./app/Components/Navigators/TabNavigator.js";
import AuthContextProvider from "./app/Components/AuthContext.js";
import TabBusinessNavigator from "./app/Components/Navigators/TabBusinessNavigator";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthNavigator,
      App: TabNavigator,
     AppBusiness: TabBusinessNavigator,
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



/*

import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import db from "./app/firebase/DatabaseManager.js";
import Animal from "./app/firebase/Animal.js";


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
        db.addUserAnimal('juioo','Willy',11,'Labrador','Medium','willy.jpg');
        //db.deleteAnimal('axr4185','juioo');
        //db.addUserFeed('axr4185','yyyhgd','Labrador needs extra hugs','Labrador are extremely emphatic dogs, needs constantly kindness and love');
        //db.deleteUserFeed('axr4185','yyyhgd');
        //db.deleteAdoptableAnimalPlace('yghuiow','juiay');
        //db.addAnimalStat('axr4185','juiay','weight');
        //db.addAnimalStatSample('axr4185','juiay','weight',20);
        //db.addAnimalStat('axr4185','juiay','height');
        //db.addAnimalStatSample('axr4185','juiay','height',50);

    }

    const getUser = async() => {
       //db.addRandomFeeds('ibdvNck5OYYT4ocQmt1PW8dQ8ro2',0);

       var animals = [];
       animals.push(new Animal('boh',1,'boh','boh','boh','Cat'));
       animals.push(new Animal('boh',7,'boh','boh','boh','Dog'));
       animals.push(new Animal('boh',13,'boh','boh','boh','Dog'));
       var day = '20/01/2021';
       db.addRandomFeeds(animals,'ibdvNck5OYYT4ocQmt1PW8dQ8ro2',day,0);

    }

   return (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Button title="Pick an image from camera roll" onPress={getUser} />
       {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
       <Button title="Open the camera" onPress={addUser} />
     </View>
   );
 }

*/
