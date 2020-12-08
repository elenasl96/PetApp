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

import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import * as firebase from "firebase";
import firebaseConfig from "./app/firebase/firebaseconfig.js";
import AuthNavigator from "./app/Components/AuthNavigator";

import HomeScreen from "./app/screens/HomeScreen.js";
import SignIn from "./app/screens/SignInScreen";
import CalendarApp from "./app/screens/calendar";
import * as Notifications from "expo-notifications";
import PetScreen from "./app/screens/petPage.js";
import TabNavigator from "./app/Components/TabNavigator.js";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default createAppContainer(
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
