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
