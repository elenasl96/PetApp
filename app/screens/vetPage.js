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
import db from "../firebase/DatabaseManager";
import News from "../Components/News";
import { AuthContext } from "../Components/AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StarButton from "../Components/Buttons/StarButton";

class VetScreen extends React.Component {
  static contextType = AuthContext;
  state = { news: null, mounted: false };

  componentDidMount() {
    const pid = this.props.navigation.state.params.pid;
    this.setState({ mounted: true });
    db.getUser(this.context.uid);
    db.getAllNews(pid).then((news) => {
      if (this.state.mounted) {
        this.setState({ news: news });
      }
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  openInMap = () => {
    this.props.navigation.navigate("Map", {
      pet: this.props.navigation.state.params.pet,
    });
  };

  render() {
    const place = this.props.navigation.state.params.place;
    const pid = this.props.navigation.state.params.pid;
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
                {place.getName()}
              </Text>

              <LinearGradient
                style={styles.buttons}
                // Background Linear Gradient
                colors={[
                  "rgba(255,255,255, 0.8)",
                  "rgba(255,255,255,0.95)",
                  "rgba(255,255,255,1)",
                ]}
              >
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.openInMap}
                >
                  <Text style={styles.buttonText}>Open in map </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    this.props.navigation.navigate("AddNews", {
                      pid: pid,
                    })
                  }
                >
                  <Text style={styles.buttonText}> + News </Text>
                </TouchableOpacity>
                <StarButton uid={this.context.uid} pid={pid} />
              </LinearGradient>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.details}>
          <Text>
            {place.getAddress()}
            {"\n"}
            {place.getDescription()}
          </Text>
        </View>

        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: 10 }}
          >
            {this.state.news ? (
              <News pid={pid} news={this.state.news}></News>
            ) : null}
          </ScrollView>
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
    margin: 10,
  },
  buttons: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    //backgroundColor: "#F9844A",
    //height: 44,
    //borderRadius: 22,

    padding: 10,
    marginLeft: 10,
    borderBottomColor: "orange",
    borderBottomWidth: 2,
  },

  buttonText: {
    color: "orange",
    alignSelf: "center",
    fontWeight: "bold",
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 10,
  },
  details: {
    paddingTop: 15,
    paddingHorizontal: 25,
    color: "black",

    //backgroundColor: "rgba(255,255,255,0.6)",
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
