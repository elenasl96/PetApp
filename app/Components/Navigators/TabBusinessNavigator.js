import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeBusinessNavigator from "./HomeBusinessNavigator.js";

import HomeNavigator from "./HomeNavigator.js";
import LostPetsNavigator from "./LostPetsNavigator.js";
import MapNavigator from "./MapNavigator.js";

const TabBusinessNavigator = createMaterialBottomTabNavigator(
  {
    Map: { screen: MapNavigator },
    Home: { screen: HomeNavigator },
    Lost: { screen: LostPetsNavigator },
    Business: { screen: HomeBusinessNavigator },
  },
  {
    initialRouteName: "Home",
    activeColor: "white",
    inactiveColor: "black",
    barStyle: { backgroundColor: "#F9844A" },
  }
);

export default TabBusinessNavigator;
