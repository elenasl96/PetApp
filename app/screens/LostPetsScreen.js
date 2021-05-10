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
import ReportLossForm from "../Components/Forms/ReportLossForm";
import mainStyle from "../styles/mainStyle";
import { Feather } from "@expo/vector-icons";

export default class LostPetsScreen extends React.Component {
  state = {
    lostPets: [],
    lostPetsSeen: [],
    showLostPets: true,
    showLostPetsSeen: false,
    showReportLossForm: false,
    showReportSightForm: false,
    mounted: false,
  };
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
    this.getLostPets();
    this.getLostPetsSeen();
  }

  componentDidUpdate() {
    if (this.state.lostPets.length != this.context.lostPets.length) {
      this.setState({ lostPets: this.context.lostPets });
      console.log("LOST PETS: " + this.state.lostPets);
    }

    if (this.state.lostPetsSeen.length != this.context.lostPetsSeen.length) {
      this.setState({ lostPetsSeen: this.context.lostPetsSeen });
      console.log("LOST PETS SEEN: " + this.state.lostPetsSeen);
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  getLostPets = () => {
    dbLostPet.getLostPetNotifications().then((lostPets) => {
      if (this.state.mounted) {
        this.context.saveLostPets(lostPets);
      }
    });
  };

  getLostPetsSeen = () => {
    dbLostPet.getLostPetsSeen().then((lostPetsSeen) => {
      if (this.state.mounted) {
        this.context.saveLostPetsSeen(lostPetsSeen);
      }
    });
  };

  reportLoss = () => {
    if (this.state.mounted) {
      this.setState({ showReportLossForm: true });
    }
  };

  reportSight = () => {
    if (this.state.mounted) {
      this.setState({ showReportSightForm: true });
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ReportLossForm
          pet={null}
          visible={this.state.showReportLossForm}
          close={() => {
            this.setState({ showReportLossForm: false });
          }}
        ></ReportLossForm>
        <ReportLossForm
          pet={null}
          sight={true}
          visible={this.state.showReportSightForm}
          close={() => {
            this.setState({ showReportSightForm: false });
          }}
        ></ReportLossForm>
        <View style={styles.mainContent}>
          <View style={styles.bottomOverlay}>
            {this.state.showLostPetsSeen ? (
              <TouchableHighlight
                style={styles.mapButton}
                onPress={() => {
                  this.reportSight();
                }}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="alert-circle" size={24} color="black" /> Report
                  sight
                </Text>
              </TouchableHighlight>
            ) : null}

            {this.state.showLostPets ? (
              <TouchableHighlight
                style={styles.mapButton}
                onPress={() => {
                  this.reportLoss();
                }}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="search" size={24} color="black" /> Report Loss
                </Text>
              </TouchableHighlight>
            ) : null}
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <View style={styles.buttons}>
                {this.state.showLostPets ? (
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
                ) : null}
                {this.state.showLostPetsSeen ? (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.setState({
                        showLostPets: true,
                        showLostPetsSeen: false,
                      });
                    }}
                  >
                    <Text style={styles.buttonText}>
                      Go to lost pets &gt; S
                    </Text>
                  </TouchableOpacity>
                ) : null}
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
                    pets={this.context.lostPets}
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
    justifyContent: "center",
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
  bottomOverlay: {
    position: "absolute",
    bottom: 20,
    right: 10,
    flex: 1,
    flexDirection: "row",
  },
  mapButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
    elevation: 2,
    marginHorizontal: 5,
    zIndex: 1,
  },
});
