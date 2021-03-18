import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../../screens/HomeScreen";
import PetScreen from "../../screens/petPage";
import KennelScreen from "../../screens/kennelPage";
import VetScreen from "../../screens/vetPage";
import React from "react";
import NavBar from "../../screens/NavBar";
import AddPetScreen from "../../screens/AddPet";
import HomeBusiness from "../../screens/BusinessUser/HomeBusiness";
import ReportLossScreen from "../../screens/ReportLoss";
import AnimalsToAdoptScreen from "../../screens/AnimalsToAdopt";

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

    AddPet: {
      screen: AddPetScreen,
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Add new pet",
      }),
    },

    ReportLoss: {
      screen: ReportLossScreen,
      navigationOptions: ({ navigation }) => ({
        title: "Report Loss",
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

    AnimalsToAdopt: {
      screen: AnimalsToAdoptScreen,
      path: "kennelProfile/:kennel",
      // Optional: Override the `navigationOptions` for the screen
      navigationOptions: ({ navigation }) => ({
        title: "Animals to adopt",
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
    /*defaultNavigationOptions: {
      headerTitle: () => <NavBar />,
    },*/
    defaultNavigationOptions: ({ navigation }) => ({
      headerTitle: () => {
        console.log("STATEEEEE");

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

export default HomeNavigator;
