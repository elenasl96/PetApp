import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
import mainStyle from "../styles/mainStyle";
import { color } from "react-native-reanimated";
class PetScreen extends React.Component {
  state = { user: {} };
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({ user: user });
      }
    });
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.petContainer}>
              <View>
                <View style={styles.pet}>
                  <ImageBackground
                    source={require("../../assets/images/Gioia.jpg")}
                    style={styles.petImage}
                    imageStyle={{ borderRadius: 20 }}
                  >
                    <Text
                      style={[
                        styles.title,
                        {
                          color: "white",
                          textShadowColor: "black",
                          textShadowRadius: 2,
                        },
                      ]}
                    >
                      Gioia
                    </Text>
                  </ImageBackground>
                </View>
              </View>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button} onPress={null}>
                <Text style={styles.buttonText}>Add info</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={null}>
                <Text style={styles.buttonText}>Delete pet</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={mainStyle.text}>Size</Text>
              <Text style={mainStyle.text}>Breed</Text>
              <Text style={mainStyle.text}>Notes</Text>
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomMenu}>
          <TouchableHighlight onPress={null}>
            <View style={styles.mainButtonContainer}>
              <Image
                source={require("../../assets/images/paw.png")}
                style={styles.mainButton}
              ></Image>
            </View>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
    padding: 10,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "powderblue",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#F9844A",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    padding: 10,
    marginLeft: 10,
  },
  buttonText: {
    alignSelf: "center",
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
  },
  petContainer: {
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "powderblue",
  },
  pet: {
    width: 300,
    height: 250,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  petImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: 300,
    height: 250,
    borderRadius: 20,
    resizeMode: "cover",
    padding: 10,
  },
  descriptionContainer: {
    padding: 10,
  },
  myPlaces: {
    flexWrap: "nowrap",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
    marginLeft: 15,
    width: 300,
    height: 150,
    borderRadius: 35,
    backgroundColor: "lightgreen",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 0,
    left: 100,
    right: 100,
    height: 70,
    alignItems: "center",
  },
  mainButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  mainButton: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    tintColor: "orange",
  },
});
export default PetScreen;
