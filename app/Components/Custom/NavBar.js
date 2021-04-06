import React, { Component } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import firebase from "firebase";
import { AuthContext } from "../AuthContext.js";
import { Ionicons } from "@expo/vector-icons";

class NavBar extends Component {
  static contextType = AuthContext;
  state = { mounted: false };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    return (
      <View style={styles.topBar}>
        <Text style={styles.mainTitle}>{this.props.title} </Text>
        <View style={styles.profileContainer}>
          {this.context.user.name ? (
            <Text style={styles.username}>{this.context.user.name} </Text>
          ) : null}
          {this.context.user.photo ? (
            <Image
              source={{
                uri: this.context.user.photo,
              }}
              style={styles.profileImage}
            ></Image>
          ) : null}
          <Ionicons
            name="md-exit"
            size={28}
            color="#f94144"
            onPress={() => {
              if (this.state.mounted) {
                firebase.auth().signOut();
              }
            }}
            style={styles.exitButton}
          />
        </View>
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
  mainContent: {
    flex: 1,
  },
  topBar: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    padding: 10,
  },
  logOff: {
    color: "#90BE6D",
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    margin: 10,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 30,
    resizeMode: "cover",
    marginLeft: 10,
  },
  title: {
    marginLeft: 15,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  exitButton: {
    marginHorizontal: 10,
  },
});

export default NavBar;
