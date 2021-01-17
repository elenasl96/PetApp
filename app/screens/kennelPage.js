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
import db from "../firebase/DatabaseManager";
import { AuthContext } from "../Components/AuthContext";
import News from "../Components/News";
class KennelScreen extends React.Component {
  static contextType = AuthContext;
  state = { news: [], mounted: false };

  componentDidMount() {
    console.log("TYYYY:" + this.context.user);
    const pid = this.props.navigation.state.params.pid;
    this.setState({ mounted: true });
    db.getUser(this.context.uid);
    db.getAllNews(pid).then((news) => {
      if (this.state.mounted) {
        this.setState({ news: news });
        console.log("NEWS");
        console.log(this.state.news);
      }
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    const place = this.props.navigation.state.params.place;
    const pid = this.props.navigation.state.params.pid;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <ImageBackground
            source={require("../../assets/images/kennel.jpg")}
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
                {place.getName()}
              </Text>
              <View style={[styles.details]}>
                <Text>
                  {place.getAddress()}
                  {"\n"}
                  {place.getDescription()}
                </Text>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={null}>
            <Text style={styles.buttonText}>See Animals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={null}>
            <Text style={styles.buttonText}>Open in map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              this.props.navigation.navigate("AddNews", {
                pid: pid,
              })
            }
          >
            <Text style={styles.buttonText}> + News</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingTop: 10 }}
          >
            <News pid={pid} news={this.state.news}></News>
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
    padding: 5,
    color: "black",
    backgroundColor: "rgba(255,255,255,0.6)",
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
export default KennelScreen;
