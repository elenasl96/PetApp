import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeBusinessNavigator from "./HomeBusinessNavigator.js";

import HomeNavigator from "./HomeNavigator.js";
import LostPetsNavigator from "./LostPetsNavigator.js";
import MapNavigator from "./MapNavigator.js";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const TabBusinessNavigator = createMaterialBottomTabNavigator(
  {
    Map: { screen: MapNavigator },
    Home: { screen: HomeNavigator },
    Lost: { screen: LostPetsNavigator },
    Business: { screen: HomeBusinessNavigator },
  },
  {
    initialRouteName: "Home",

    barStyle: { backgroundColor: "#fff" },

    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Home") {
          iconName = focused ? "md-home" : "md-home";
        } else if (routeName === "Map") {
          iconName = focused ? "md-map" : "md-map";
        } else if (routeName === "Lost") {
          iconName = focused ? "md-paw" : "md-paw";
        } else if (routeName === "Business") {
          iconName = focused ? "md-business" : "md-business";
        }
        return <Ionicons name={iconName} size={24} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray",
    },
  }
);

export default TabBusinessNavigator;
