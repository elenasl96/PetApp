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
import Line from "../Components/Line";
class VetScreen extends React.Component {
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
        <View>
          <ImageBackground
            source={require("../../assets/images/vet.jpg")}
            style={styles.vetImage}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 10,
              }}
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
                Veterinary
              </Text>
              <View style={[styles.details]}>
                <Text>
                  Via Milano, 10 Milano, Mi{"\n"}
                  Tel. 02/123455
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={null}>
            <Text style={styles.buttonText}>Make Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={null}>
            <Text style={styles.buttonText}>Open in map</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: 10 }}
          >
            <View style={styles.feedContainer}>
              <View style={styles.feed}>
                <Text>News2</Text>
                <Line></Line>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  ultricies posuere nulla, nec fermentum justo tempus ac. Donec
                  magna lorem, maximus et hendrerit id, rutrum vel sapien. Sed
                  sed imperdiet ipsum. Duis venenatis ultrices mi dignissim
                  molestie. Quisque vestibulum ipsum id nulla venenatis, in
                  elementum lacus ornare. Proin rutrum hendrerit felis fermentum
                  ultrices.
                </Text>
                <Line></Line>
                <Text>12/12/2020 8:00</Text>
              </View>
            </View>
            <View style={styles.feedContainer}>
              <View style={styles.feed}>
                <Text>News2</Text>
                <Line></Line>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  ultricies posuere nulla, nec fermentum justo tempus ac. Donec
                  magna lorem, maximus et hendrerit id, rutrum vel sapien. Sed
                  sed imperdiet ipsum. Duis venenatis ultrices mi dignissim
                  molestie. Quisque vestibulum ipsum id nulla venenatis, in
                  elementum lacus ornare. Proin rutrum hendrerit felis fermentum
                  ultrices.
                </Text>
                <Line></Line>
                <Text>12/12/2020 8:00</Text>
              </View>
            </View>
            <View style={styles.feedContainer}>
              <View style={styles.feed}>
                <Text>News2</Text>
                <Line></Line>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                  ultricies posuere nulla, nec fermentum justo tempus ac. Donec
                  magna lorem, maximus et hendrerit id, rutrum vel sapien. Sed
                  sed imperdiet ipsum. Duis venenatis ultrices mi dignissim
                  molestie. Quisque vestibulum ipsum id nulla venenatis, in
                  elementum lacus ornare. Proin rutrum hendrerit felis fermentum
                  ultrices.
                </Text>
                <Line></Line>
                <Text>12/12/2020 8:00</Text>
              </View>
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
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
    padding: 10,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: "bold",
  },
  buttons: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    backgroundColor: "#F9844A",
    height: 44,
    borderRadius: 22,
    padding: 10,
    marginLeft: 10,
  },
  buttonText: {
    alignSelf: "center",
  },
  feedContainer: {
    width: "95%",
    paddingBottom: 20,
    alignSelf: "center",
  },
  feed: {
    backgroundColor: "powderblue",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  details: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "black",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
  },
  vetImage: {
    width: "100%",
    height: 200,
    borderRadius: 75,
    resizeMode: "cover",
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
export default VetScreen;
