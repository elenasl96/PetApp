import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "../screens/HomeScreen";
import PetScreen from "../screens/petPage";

const HomeNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    // Optional: When deep linking or using react-navigation in a web app, this path is used:
    path: "home",
    // The action and route params are extracted from the path.

    // Optional: Override the `navigationOptions` for the screen
    navigationOptions: ({ navigation }) => ({
      title: `'s Profile'`,
    }),
  },

  Pet: {
    screen: PetScreen,
    path: "petProfile/:pet",
    // Optional: Override the `navigationOptions` for the screen
    navigationOptions: ({ navigation }) => ({
      title: `'s Profile'`,
    }),
  },
});

export default HomeNavigator;
