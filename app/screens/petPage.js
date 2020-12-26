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
              <View style={styles.pet}>
                <ImageBackground
                  source={require("../../assets/images/Gioia.jpg")}
                  style={styles.petImage}
                  imageStyle={{ borderRadius: 50 }}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color: "white",
                        textShadowColor: "black",
                        textShadowRadius: 2,
                        alignSelf: "center",
                      },
                    ]}
                  >
                    Gioia
                  </Text>
                </ImageBackground>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={null}>
                  <Text style={styles.buttonText}>Add info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={null}>
                  <Text style={styles.buttonText}>Delete pet</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Size</Text>
                  <Text>Medium</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Weight</Text>
                  <Text>20kg</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Height</Text>
                  <Text>50cm</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Breed</Text>
                  <Text>Labrador</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Disease</Text>
                  <Text>Nothing</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>

            <View style={styles.descriptionContainer}>
              <Text style={mainStyle.text}>Chart</Text>
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
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    paddingBottom: 10,
  },
  button: {
    backgroundColor: "#F9844A",
    height: 44,
    borderRadius: 22,
    padding: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  buttonText: {
    alignSelf: "center",
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  petContainer: {
    flex: 1,

    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 20,
  },
  pet: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "white",
    marginLeft: 10,
  },
  petImage: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
    padding: 10,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F9C74F",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
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
