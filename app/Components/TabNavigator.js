import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import HomeScreen from "../screens/HomeScreen.js";
import PetScreen from "../screens/petPage.js";

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Pet: { screen: PetScreen },
  },
  {
    initialRouteName: "Home",
    activeColor: "#f0edf6",
    inactiveColor: "#3e2465",
    barStyle: { backgroundColor: "#694fad" },
  }
);

export default TabNavigator;
