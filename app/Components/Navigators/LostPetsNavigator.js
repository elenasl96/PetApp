import { createStackNavigator } from "react-navigation-stack";
import PetScreen from "../../screens/PetPage";
import React from "react";
import NavBar from "../custom/NavBar";
import LostPetsScreen from "../../screens/LostPetsScreen";
import LostPetNotifyScreen from "../../screens/LostPetNotifyScreen";

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

    LostPet: {
      screen: LostPetNotifyScreen,
      path: "petProfile/:pet",
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "-name- profile",
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
        backgroundColor: "#f4978e",
      },
      //headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "italic",
      },
    }),
  }
);

export default LostPetsNavigator;
