import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";
import { AuthContext } from "../Components/AuthContext";
class LoadingScreen extends React.Component {
  static contextType = AuthContext;

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        /*user.getIdToken().then(function (idToken) {
          console.log(idToken);
          return idToken;
        });*/
        this.context.saveUserUID(user.uid);
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("SignUp");
      }
    });
  }
  render() {
    console.log(this.context);
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default LoadingScreen;
