import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { AuthContext } from "../Components/AuthContext";
import dbLostPet from "../firebase/Database/Functions/dbLostPet";
import PetLostButton from "../Components/Buttons/PetLostButton";
import PetLostSeenButton from "../Components/Buttons/PetLostSeenButton";
import mainStyle from "../styles/mainStyle";

export default class LostPetsScreen extends React.Component {
  state = {
    lostPets: [],
    showLostPets: true,
    lostPetsSeen: [],
    showLostPetsSeen: false,
    mounted: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    dbLostPet.getLostPetNotifications().then((lostPetsIDs) => {
      if (this.state.mounted) {
        console.log("lostpets");
        console.log(lostPetsIDs);
        this.setState({ lostPets: lostPetsIDs });
      }
    });

    dbLostPet.getLostPetsSeen().then((lostPetsSeenIDs) => {
      if (this.state.mounted) {
        console.log("lostpetsSeen");
        console.log(lostPetsSeenIDs);
        this.setState({ lostPetsSeen: lostPetsSeenIDs });
      }
    });
  }

  componentDidUpdate() {
    if (this.state.lostPets == null) {
      dbLostPet.getLostPetNotifications().then((lostPetsIDs) => {
        if (this.state.mounted) {
          console.log("lostpets");
          console.log(lostPetsIDs);
          this.setState({ lostPets: lostPetsIDs });
        }
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.setState({
                      showLostPets: false,
                      showLostPetsSeen: true,
                    });
                  }}
                >
                  <Text style={styles.buttonText}>
                    Go to pets sights &gt; S
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.setState({
                      showLostPets: true,
                      showLostPetsSeen: false,
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Go to lost pets &gt; S</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {this.state.lostPets.length > 0 && this.state.showLostPets ? (
                  <PetLostButton
                    navigation={this.props.navigation}
                    pets={this.state.lostPets}
                  ></PetLostButton>
                ) : null}

                {this.state.lostPetsSeen.length > 0 &&
                this.state.showLostPetsSeen ? (
                  <PetLostSeenButton
                    navigation={this.props.navigation}
                    pets={this.state.lostPetsSeen}
                  ></PetLostSeenButton>
                ) : null}
              </View>
            </View>
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
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 35,
    padding: 10,
  },
  buttons: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
    paddingRight: 20,
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
    flex: 1,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  place: {
    width: "100%",
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
