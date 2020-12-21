import React from 'react';
import {firebaseConfig} from './firebaseconfig.js';
import { StyleSheet, Text, View } from 'react-native';


var app = firebase.initializeApp(firebaseConfig);
db = firebase.firestore(app);

function AddUser(int age, string name){
      const users = db.collection('Users');
      user = new User(age,name);
      users.add(user.toFirestore())
      .then(function(docRef)){
        console.log("Document written with ID:",docRef.id)};
      })
      .catch(function(error)){
        console.error("Error adding document:",error);
      });
}

AddUser(20,'Anna White');



