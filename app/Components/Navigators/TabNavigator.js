import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeScreen from "../../screens/HomeScreen.js";
import MapScreen from "../../screens/MapScreen.js";
import HomeNavigator from "./HomeNavigator.js";
import LostPetsNavigator from "./LostPetsNavigator.js";
import MapNavigator from "./MapNavigator.js";

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Map: { screen: MapNavigator },
    Home: { screen: HomeNavigator },
    Lost: { screen: LostPetsNavigator },
  },
  {
    initialRouteName: "Home",
    activeColor: "white",
    inactiveColor: "black",
    barStyle: { backgroundColor: "#F9844A" },
  }
);

export default TabNavigator;
