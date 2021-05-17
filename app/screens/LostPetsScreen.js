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
    lostPetsMatched: [],
    showPetsMatched: false,
    mounted: false,
    report: null,
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
      //console.log("LOST PETS: " + this.state.lostPets);
    }

    if (this.state.lostPetsSeen.length != this.context.lostPetsSeen.length) {
      this.setState({ lostPetsSeen: this.context.lostPetsSeen });
      //console.log("LOST PETS SEEN: " + this.state.lostPetsSeen);
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

  sendForm = (lostPet, seen) => {
    const pet = this.props.pet;
    this.setState({ report: lostPet });
    console.log("pet");
    console.log(this.context.uid);
    if (seen) {
      dbLostPet.getLostPetsMatched(lostPet).then((lostPetsMatched) => {
        if (lostPetsMatched.length > 0) {
          this.setState({
            showLostPets: false,
            showLostPetsSeen: false,
            showReportLossForm: false,
            lostPetsMatched: lostPetsMatched,
            showPetsMatched: true,
          });
        } else {
          this.confirmReport(lostPet);
          this.setState({ showReportLossForm: false });
        }
      });
    } else {
      dbLostPet.getLostPetsMatched(lostPet).then((lostPetsMatched) => {
        if (lostPetsMatched.length > 0) {
          this.setState({
            showLostPets: false,
            showLostPetsSeen: false,
            showReportLossForm: false,
            lostPetsMatched: lostPetsMatched,
            showPetsMatched: true,
          });
        } else {
          this.confirmReport(lostPet);
          this.setState({ showReportLossForm: false });
        }
      });
    }

    /*dbLostPet
        .addLostPetNotify(
          this.state.name,
          this.state.photo,
          this.state.size,
          this.state.color,
          this.state.breed,
          this.state.notes,
          this.state.place,
          this.context.uid,
          this.state.email,
          this.state.telephone
        )
        .then((doc) => {
          console.log("LOST PET ID TO ADD");
          console.log(doc.id);
          this.context.lostPets.push(doc.id);
          this.context.saveLostPets(this.context.lostPets);
          console.log("LOST PETS TO UPDATE:");
          console.log(this.context.lostPets);
          this.props.close();
        }); */
  };

  reportSight = () => {
    if (this.state.mounted) {
      this.setState({ showReportSightForm: true });
    }
  };

  cancelReport = () => {
    if (this.state.mounted) {
      this.setState({
        showPetsMatched: false,
        showLostPets: true,
        lostPetsMatched: null,
      });
    }
  };

  confirmReport = () => {
    console.log(this.state.report);
    dbLostPet
      .addLostPetNotify(
        this.state.report.getName(),
        this.state.report.getPhoto(),
        this.state.report.getSize(),
        this.state.report.getColor(),
        this.state.report.getBreed(),
        this.state.report.getNotes(),
        this.state.report.getPlace(),
        this.context.uid,
        this.state.report.getEmail(),
        this.state.report.getPhone()
      )
      .then((doc) => {
        console.log("LOST PET ID TO ADD");
        console.log(doc.id);
        this.context.lostPets.push(doc.id);
        this.context.saveLostPets(this.context.lostPets);
        console.log("LOST PETS TO UPDATE:");
        console.log(this.context.lostPets);
        this.setState({ showPetsMatched: false, showLostPets: true });
      });
  };

  confirmReportSeen = () => {
    console.log(this.state.report);
    dbLostPet
      .addLostPetSeen(
        this.state.photo,
        this.state.size,
        this.state.color,
        this.state.breed,
        this.state.notes,
        this.state.place,
        this.context.uid,
        this.state.email,
        this.state.phone
      )
      .then((doc) => {
        console.log("LOST PET SEEN ID TO ADD");
        console.log(doc.id);
        this.context.lostPetsSeen.push(doc.id);
        this.context.saveLostPetsSeen(this.context.lostPetsSeen);
        console.log("LOST PETS SEEN TO UPDATE:");
        console.log(this.context.lostPetsSeen);
        this.setState({ showPetsMatched: false, showLostPetsSeen: true });
      });
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
          navigation={this.props.navigation}
          sendForm={this.sendForm}
        ></ReportLossForm>
        <ReportLossForm
          pet={null}
          sight={true}
          visible={this.state.showReportSightForm}
          close={() => {
            this.setState({ showReportSightForm: false });
          }}
          navigation={this.props.navigation}
        ></ReportLossForm>
        <View style={styles.mainContent}>
          <View style={styles.bottomOverlay}>
            {this.state.showPetsMatched ? (
              <TouchableHighlight
                style={styles.mapButton}
                onPress={() => {
                  this.confirmReport();
                }}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="alert-circle" size={24} color="black" /> Send
                  report
                </Text>
              </TouchableHighlight>
            ) : null}

            {this.state.showPetsMatched ? (
              <TouchableHighlight
                style={styles.mapButton}
                onPress={() => {
                  this.cancelReport();
                }}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="alert-circle" size={24} color="black" /> Cancel
                </Text>
              </TouchableHighlight>
            ) : null}
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.myPlacesContainer}>
              <View style={styles.buttons}>
                {this.state.showLostPets ? (
                  <TouchableHighlight
                    onPress={() => {
                      this.reportLoss();
                    }}
                    underlayColor={"rgb(200,200,200)"}
                  >
                    <View style={styles.button}>
                      <Feather name="alert-triangle" size={24} color="white" />
                      <Text style={styles.buttonText}>Report Loss </Text>
                    </View>
                  </TouchableHighlight>
                ) : null}
                {this.state.showLostPets ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showLostPets: false,
                        showLostPetsSeen: true,
                      });
                    }}
                  >
                    <View style={styles.button}>
                      <Feather
                        name="arrow-right-circle"
                        size={24}
                        color="white"
                      />
                      <Text style={styles.buttonText}>Go to pet sights </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
                {this.state.showLostPetsSeen ? (
                  <TouchableHighlight
                    onPress={() => {
                      this.reportSight();
                    }}
                    underlayColor={"rgb(200,200,200)"}
                  >
                    <View style={styles.button}>
                      <Feather name="alert-circle" size={24} color="white" />
                      <Text style={styles.buttonText}>Report sight </Text>
                    </View>
                  </TouchableHighlight>
                ) : null}
                {this.state.showLostPetsSeen ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showLostPets: true,
                        showLostPetsSeen: false,
                      });
                    }}
                  >
                    <View style={styles.button}>
                      <Feather
                        name="arrow-right-circle"
                        size={24}
                        color="white"
                      />
                      <Text style={styles.buttonText}>Go to lost pets </Text>
                    </View>
                  </TouchableOpacity>
                ) : null}
              </View>

              {this.state.showLostPets ? (
                <Text style={styles.title}>Lost pets</Text>
              ) : null}
              {this.state.showLostPets ? (
                <Text style={styles.text}>
                  Help other owners to find their beloved pets or report your
                  loss clicking on the button below.
                </Text>
              ) : null}

              {this.state.showLostPetsSeen ? (
                <Text style={styles.title}>Lost pets seen</Text>
              ) : null}
              {this.state.showLostPetsSeen ? (
                <Text style={styles.text}>
                  All sightings will be reported in this section.
                </Text>
              ) : null}

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

                {this.state.showPetsMatched ? (
                  <View>
                    <Text style={styles.title}>Matched Pets</Text>
                    <PetLostButton
                      navigation={this.props.navigation}
                      pets={this.state.lostPetsMatched}
                    ></PetLostButton>
                  </View>
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
    paddingTop: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 10,
    paddingRight: 20,
  },
  button: {
    backgroundColor: "#F9844A",
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginLeft: 10,
    overflow: "hidden",
    elevation: 2,
    //borderBottomColor: "orange",
    //borderBottomWidth: 2,
  },

  buttonText: {
    color: "white",
    alignSelf: "center",
    fontWeight: "bold",
    marginLeft: 5,
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
    textAlign: "center",
  },
  text: {
    marginLeft: 15,
    marginVertical: 15,
    fontSize: 15,
    textAlign: "center",
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
