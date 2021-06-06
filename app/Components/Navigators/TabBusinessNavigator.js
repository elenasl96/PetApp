import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeBusinessNavigator from "./HomeBusinessNavigator.js";

import HomeNavigator from "./HomeNavigator.js";
import LostPetsNavigator from "./LostPetsNavigator.js";
import MapNavigator from "./MapNavigator.js";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

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
          iconName = require("../../../assets/images/draws/dog-house.png");
        } else if (routeName === "Map") {
          iconName = focused ? "md-map" : "md-map";
          iconName = require("../../../assets/images/draws/pet-shop.png");
        } else if (routeName === "Lost") {
          iconName = focused ? "md-paw" : "md-paw";
          iconName = require("../../../assets/images/draws/muzzle.png");
        } else if (routeName === "Business") {
          iconName = focused ? "md-business" : "md-business";
          iconName = require("../../../assets/images/draws/pet-shop(2).png");
        }
        //return <Ionicons name={iconName} size={24} color={tintColor} />;
        return (
          <Image style={{ width: 25, height: 25 }} source={iconName}></Image>
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray",
    },
  }
);

export default TabBusinessNavigator;
