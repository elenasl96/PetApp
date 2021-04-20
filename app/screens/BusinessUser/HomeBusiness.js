import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import firebase from "firebase";
import { AuthContext } from "../../Components/AuthContext";
import dbPlace from "../../firebase/Database/Functions/dbPlace.js";
import PlaceButton from "../../Components/Buttons/PlaceButton";
import AddPlaceForm from "../../Components/Forms/AddPlaceForm";

export default class HomeBusiness extends React.Component {
  state = {
    places: [],
    mounted: false,
    showPlaceForm: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dbPlace.getMyPlaces(this.context.uid).then((ids) => {
          console.log(ids);
          ids.map((id) => {
          dbPlace.getMyPlace(this.context.uid,id).then((pid) => {
            if (this.state.mounted) {
                         this.state.places.push(pid);
                         this.setState({ mounted: true });
            }
          });
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  addPlace = () => {
    console.log("tt");
    if (this.state.mounted) {
      this.setState({ showPlaceForm: true });
    }
  };

  render() {
    const showPlace = () => {
      this.props.navigation.navigate("Pet");
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AddPlaceForm
          visible={this.state.showPlaceForm}
          close={() => {
            this.setState({ showPlaceForm: false });
          }}
        ></AddPlaceForm>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <Text style={styles.title}>My Places</Text>
              <View style={styles.myPlaces}>
                <ScrollView
                  vertical={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <TouchableHighlight
                    onPress={this.addPlace}
                    style={styles.placeButton}
                  >
                    <Image
                      source={require("../../../assets/images/add.png")}
                      style={styles.addButton}
                    ></Image>
                  </TouchableHighlight>
                  <PlaceButton
                    uid={this.context.uid}
                    places={this.state.places}
                    navigation={this.props.navigation}
                  ></PlaceButton>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomMenu}>
          <TouchableHighlight onPress={null}>
            <View style={styles.mainButtonContainer}>
              <Image
                source={require("../../../assets/images/paw.png")}
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
  placeButton: {
    width: 80,
    height: 80,
    borderRadius: 75,
    backgroundColor: "orange",
    alignSelf: "center",
    marginBottom: 10,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 75,
    resizeMode: "cover",
    margin: 15,
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

  myPlacesContainer: {
    flexDirection: "column",
  },
  title: {
    marginLeft: 15,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  myPlaces: {
    flexWrap: "nowrap",
    flexDirection: "column",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    flex: 1,
    borderRadius: 35,
    backgroundColor: "lightgreen",
  },
  placeImage: {
    width: "100%",
    height: 150,
    borderRadius: 35,
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
