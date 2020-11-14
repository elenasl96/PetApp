import React from 'react';
import {db} from './firebaseconfig.js';
import { StyleSheet, Text, View } from 'react-native';

function User(props){
      const users = db.collection('Users');
      users.add({
          name: 'Anna Black',
          age: 30,
        });
      const target=users.where('age', '>=', 18).get();
      console.log(target);
      return true;
  }

export default User;

//connects to firestore but gives a warning