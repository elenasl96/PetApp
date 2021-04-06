import { createStackNavigator } from "react-navigation-stack";
import PetScreen from "../../screens/petPage";
import React from "react";
import NavBar from "../Custom/NavBar";
import AddPetScreen from "../../screens/AddPet";
import LostPetsScreen from "../../screens/LostPetsScreen";
import LostPetNotifyScreen from "../../screens/LostPetNotifyScreen";
import LostPetsSeenScreen from "../../screens/LostPetsSeenScreen";

const LostPetsNavigator = createStackNavigator(
  {
    LostPets: {
      screen: LostPetsScreen,
      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: "home",
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Homepage    ",
      }),
    },

    LostPetsSeen: {
      screen: LostPetsSeenScreen,
      // Optional: When deep linking or using react-navigation in a web app, this path is used:
      path: "home",
      // The action and route params are extracted from the path.

      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Homepage    ",
      }),
    },

    LostPet: {
      screen: LostPetNotifyScreen,
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
  },
  {
    initialRouteName: "LostPets",
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: ({ navigation }) => ({
      headerTitle: () => {
        const { routeName } = navigation.state;
        return <NavBar title={routeName} />;
      },
      headerStyle: {
        backgroundColor: "#F9844A",
      },
      //headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "italic",
      },
    }),
  }
);

export default LostPetsNavigator;
