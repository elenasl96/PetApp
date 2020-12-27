import React, { Component } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import firebase from "firebase";

class NavBar extends Component {
  render() {
    return (
      <View style={styles.topBar}>
        <Text style={styles.mainTitle}>GPaw </Text>

        <View style={styles.profileContainer}>
          <Button
            color="#43AA8B"
            title="LogOff"
            onPress={() => {
              firebase.auth().signOut();
            }}
          />
          {/*<Text style={styles.username}>{this.context.username}</Text>*/}
          <Image
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2015/09/02/13/24/girl-919048_960_720.jpg",
            }}
            style={styles.profileImage}
          ></Image>
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
    width: 50,
    height: 50,
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
});

export default NavBar;
