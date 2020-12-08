import { createSwitchNavigator } from "react-navigation";
import LoadingScreen from "../screens/LoadingScreen.js";
import SignUpScreen from "../screens/SignUpScreen.js";
import SignInScreen from "../screens/SignInScreen.js";
const AuthNavigator = createSwitchNavigator(
  {
    Loading: { screen: LoadingScreen },
    SignUp: { screen: SignUpScreen },
    SignIn: { screen: SignInScreen },
  },
  { initialRouteName: "Loading" }
);
export default AuthNavigator;
