import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeScreen from "../screens/HomeScreen.js";
import MapScreen from "../screens/Map.js";
import PetScreen from "../screens/petPage.js";
import HomeNavigator from "./HomeNavigator.js";

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeNavigator },
    Map: { screen: MapScreen },
  },
  {
    initialRouteName: "Home",
    activeColor: "#f0edf6",
    inactiveColor: "#3e2465",
    barStyle: { backgroundColor: "#694fad" },
  }
);

export default TabNavigator;
