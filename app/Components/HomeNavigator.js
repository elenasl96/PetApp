import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import PetScreen from "../screens/petPage";
import KennelScreen from "../screens/kennelPage";
import VetScreen from "../screens/vetPage";
import React from "react";
import NavBar from "../screens/NavBar";
import AddPetScreen from "../screens/AddPet";

const HomeNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: "home",
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Homepage    ",
      }),
    },

    Pet: {
      screen: PetScreen,
      path: "petProfile/:pet",
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "-name- profile",
      }),
    },

    AddPet: {
      screen: AddPetScreen,
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Add new pet",
      }),
    },

    Kennel: {
      screen: KennelScreen,
      path: "kennelProfile/:kennel",
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "-name- profile",
      }),
    },

    Vet: {
      screen: VetScreen,
      path: "vetProfile/:vet",
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "-name- profile",
      }),
    },
  },
  {
    initialRouteName: "Home",
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerTitle: () => <NavBar />,
      headerStyle: {
        backgroundColor: "#F9844A",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "italic",
      },
    },
  }
);

export default HomeNavigator;
