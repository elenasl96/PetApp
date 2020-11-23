/* import React from 'react';
import Welcome from './app/screens/Welcome';
import User from './app/firebase/Query';
import Map from './app/screens/Map';

export default function App() {
  return (
   //<Welcome/>
   //<User/>
   <Map/>
  );
} */

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import * as firebase from 'firebase';
import firebaseConfig from './app/firebase/firebaseconfig.js';
import AuthNavigator from './app/screens/AuthNavigator';
import HomeScreen from './app/screens/HomeScreen.js';
import SignIn from './app/screens/SignInScreen';


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default createAppContainer(
  createSwitchNavigator(
    {
      Auth: AuthNavigator,
      App: HomeScreen,
      SignIn : SignIn,
    },
    {
      initialRouteName: 'Auth'
    }
  )
);

