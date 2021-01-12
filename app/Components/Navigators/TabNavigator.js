import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeScreen from "../../screens/HomeScreen.js";
import MapScreen from "../../screens/Map.js";
import HomeNavigator from "./HomeNavigator.js";
import LostPetsNavigator from "./LostPetsNavigator.js";

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeNavigator },
    Map: { screen: MapScreen },
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
