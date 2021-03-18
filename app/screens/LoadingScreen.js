import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";
import { AuthContext } from "../Components/AuthContext";
import db from "../firebase/DatabaseManager";
class LoadingScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    mounted: true,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        /*user.getIdToken().then(function (idToken) {
          console.log(idToken);
          return idToken;
        });*/

        this.context.saveUserUID(user.uid);
        db.getUser(user.uid).then((user) => {
          this.context.saveUser(user);
          console.log("usertype:" + user.getType());
          if (user.getType() == "user") {
            if (this.state.mounted) {
              this.props.navigation.navigate("App");
            }
          } else {
            if (this.state.mounted) {
              this.props.navigation.navigate("AppBusiness");
            }
          }
        });
      } else {
        if (this.state.mounted) {
          this.props.navigation.navigate("SignUp");
        }
      }
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
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
