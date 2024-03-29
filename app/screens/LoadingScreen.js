import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import firebase from "firebase";
import { AuthContext } from "../components/custom/ContextProvider";
import dbUser from "../firebase/database/functions/DbUser";
class LoadingScreen extends React.Component {
  static contextType = AuthContext;
  state = {
    mounted: true,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.context.saveUserUID(user.uid);
        dbUser.getUser(user.uid).then((user) => {
          this.context.saveUser(user);
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
