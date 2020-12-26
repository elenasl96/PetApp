import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeScreen from "../screens/HomeScreen.js";
import MapScreen from "../screens/Map.js";
import PetScreen from "../screens/petPage.js";
import CalendarScreen from "../screens/calendar.js";
import HomeNavigator from "./HomeNavigator.js";
import AuthContextProvider from "./AuthContext.js";

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeNavigator },
    Map: { screen: MapScreen },
    Calendar: { screen: CalendarScreen },
  },
  {
    initialRouteName: "Home",
    activeColor: "white",
    inactiveColor: "black",
    barStyle: { backgroundColor: "#F9844A" },
  }
);

export default TabNavigator;
