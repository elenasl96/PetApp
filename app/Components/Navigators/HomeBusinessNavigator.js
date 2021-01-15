import { createStackNavigator } from "react-navigation-stack";
import PetScreen from "../../screens/petPage";
import KennelScreen from "../../screens/kennelPage";
import VetScreen from "../../screens/vetPage";
import React from "react";
import NavBar from "../../screens/NavBar";
import AddPlaceScreen from "../../screens/BusinessUser/AddPlace";
import HomeBusiness from "../../screens/BusinessUser/HomeBusiness";

const HomeBusinessNavigator = createStackNavigator(
  {
    HomeBusiness: {
      screen: HomeBusiness,
      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: "homeBusiness",
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

    AddPlace: {
      screen: AddPlaceScreen,
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Add new place",
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
    initialRouteName: "HomeBusiness",
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

export default HomeBusinessNavigator;
