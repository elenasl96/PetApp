import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-navigation";
import { AuthContext } from "../components/custom/ContextProvider";
import dbLostPet from "../firebase/database/functions/DbLostPet";
import PetLostButton from "../components/buttons/PetLostButton";
import PetLostSeenButton from "../components/buttons/PetLostSeenButton";
import ReportLossForm from "../components/forms/ReportLossForm";
import { Feather } from "@expo/vector-icons";
import LoadingOverlay from "../components/custom/LoadingOverlay";
import FilterButton from "../components/buttons/FilterButton";
import * as Location from "expo-location";
import utils from "../shared/Utilities";

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
    loading: true,
  };
  static contextType = AuthContext;

  loadInfo() {
    this.getLostPets();
    this.getLostPetsSeen();
  }

  componentDidMount() {
    this.setState({ mounted: true });
    this.loadInfo();
  }

  componentDidUpdate() {
    if (
      this.state.lostPets.length != this.context.lostPets.length ||
      this.state.lostPets != this.context.lostPets
    ) {
      this.setState({ lostPets: [] });
      this.setState({ update: true, lostPets: this.context.lostPets });
    }

    if (
      this.state.lostPetsSeen.length != this.context.lostPetsSeen.length ||
      this.state.lostPetsSeen != this.context.lostPetsSeen
    ) {
      this.setState({ lostPetsSeen: [] });
      this.setState({ update: true, lostPetsSeen: this.context.lostPetsSeen });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  getLostPets = () => {
    return dbLostPet.getLostPetNotifications().then((lostPets) => {
      if (this.state.mounted) {
        this.context.saveLostPets(lostPets);
        this.setState({ loading: false });
        return lostPets;
      }
    });
  };

  getLostPetsAnimals = (lostPetsIDs) => {
    let promises = lostPetsIDs.map((petID) => {
      return dbLostPet.getLostPetNotification(petID).then((animal) => {
        animal.id = petID;
        return animal;
      });
    });

    return Promise.all(promises).then((lostPets) => {
      return lostPets;
    });
  };

  getLostPetsSeen = () => {
    return dbLostPet.getLostPetsSeen().then((lostPetsSeen) => {
      if (this.state.mounted) {
        this.context.saveLostPetsSeen(lostPetsSeen);
        return lostPetsSeen;
      }
    });
  };

  getLostPetsSeenAnimals = (lostPetsIDs) => {
    let promises = lostPetsIDs.map((petID) => {
      return dbLostPet.getLostPetSeen(petID).then((animal) => {
        animal.id = petID;
        return animal;
      });
    });

    return Promise.all(promises).then((lostPets) => {
      return lostPets;
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

    dbLostPet.getLostPetsMatched(lostPet).then((lostPetsMatched) => {
      if (lostPetsMatched.length > 0) {
        this.setState({
          showLostPets: false,
          showLostPetsSeen: false,
          showReportLossForm: false,
          showReportSightForm: false,
          lostPetsMatched: lostPetsMatched,
          showPetsMatched: !seen,
          showPetsMatchedSeen: seen,
        });
      } else {
        if (seen) {
          this.confirmReportSeen(lostPet);
        } else {
          this.confirmReport(lostPet);
        }

        this.setState({ showReportLossForm: false });
      }
    });
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
        showPetsMatchedSeen: false,
        showLostPets: true,
        lostPetsMatched: null,
      });
    }
  };

  confirmReport = (lostPet) => {
    dbLostPet
      .addLostPetNotify(
        lostPet.name,
        lostPet.photo,
        lostPet.size,
        lostPet.color,
        lostPet.breed,
        lostPet.notes,
        lostPet.place,
        this.context.uid,
        lostPet.email,
        lostPet.phone,
        lostPet.latitude,
        lostPet.longitude
      )
      .then((doc) => {
        this.context.lostPets.unshift(doc.id);
        this.context.saveLostPets(this.context.lostPets);
        this.setState({
          showPetsMatched: false,
          showPetsMatchedSeen: false,
          showLostPets: true,
          showReportLossForm: false,
        });
      });
  };

  confirmReportSeen = (lostPet) => {
    dbLostPet
      .addLostPetSeen(
        lostPet.photo,
        lostPet.size,
        lostPet.color,
        lostPet.breed,
        lostPet.notes,
        lostPet.place,
        this.context.uid,
        lostPet.email,
        lostPet.phone,
        lostPet.latitude,
        lostPet.longitude
      )
      .then((doc) => {
        this.context.lostPetsSeen.unshift(doc.id);
        this.context.saveLostPetsSeen(this.context.lostPetsSeen);
        this.setState({
          showPetsMatched: false,
          showPetsMatchedSeen: false,
          showLostPetsSeen: true,
          showReportLossForm: false,
        });
      });
  };

  orderByDistance = async () => {
    if (this.state.showLostPets) {
      this.setState({ showLostPets: false, loading: true });
      let { status } = await Location.requestPermissionsAsync();

      if (status === "granted") {
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        })
          .then((location) => {
            this.setState({ currentPosition: location });
            this.getLostPetsAnimals(this.context.lostPets).then((lostPets) => {
              lostPets.forEach((pet) => {
                pet.distance = utils.calcDistance(location.coords, pet);
              });
              lostPets.sort(utils.compareDistance);
              let updatePets = [];
              lostPets.forEach((pet) => {
                updatePets.push(pet.id);
              });
              if (this.state.mounted) {
                this.context.saveLostPets(updatePets);
              }
              this.setState({ showLostPets: true, loading: false });
            });
          })
          .catch((error) => {});
      } else {
        throw new Error("Location permission not granted");
      }
    } else if (this.state.showLostPetsSeen) {
      this.setState({ showLostPetsSeen: false, loading: true });
      let { status } = await Location.requestPermissionsAsync();

      if (status === "granted") {
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        })
          .then((location) => {
            this.setState({ currentPosition: location });
            this.getLostPetsSeenAnimals(this.context.lostPetsSeen).then(
              (lostPetsSeen) => {
                lostPetsSeen.forEach((pet) => {
                  pet.distance = utils.calcDistance(location.coords, pet);
                });
                lostPetsSeen.sort(utils.compareDistance);
                let updatePets = [];
                lostPetsSeen.forEach((pet) => {
                  updatePets.push(pet.id);
                });
                if (this.state.mounted) {
                  this.context.saveLostPetsSeen(updatePets);
                }
                this.setState({ showLostPetsSeen: true, loading: false });
              }
            );
          })
          .catch((error) => {});
      } else {
        throw new Error("Location permission not granted");
      }
    }
  };

  orderByNewest = () => {
    if (this.state.showLostPets) {
      if (this.state.mounted) {
        this.setState({ showLostPets: false, loading: true });
      }
      this.getLostPets().then((lostPets) => {
        if (this.state.mounted) {
          this.context.saveLostPets(lostPets);
        }
        this.setState({ showLostPets: true, loading: false });
      });
    } else if (this.state.showLostPetsSeen) {
      if (this.state.mounted) {
        this.setState({ showLostPetsSeen: false, loading: true });
      }
      this.getLostPetsSeen().then((lostPetsSeen) => {
        if (this.state.mounted) {
          this.context.saveLostPetsSeen(lostPetsSeen);
        }
        this.setState({ showLostPetsSeen: true, loading: false });
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LoadingOverlay visible={this.state.loading}></LoadingOverlay>
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
          sendForm={this.sendForm}
        ></ReportLossForm>
        <View style={styles.mainContent}>
          <View style={styles.bottomOverlay}>
            {this.state.showLostPets || this.state.showLostPetsSeen ? (
              <FilterButton
                orderByDistance={this.orderByDistance}
                orderByNewest={this.orderByNewest}
              ></FilterButton>
            ) : null}
            {this.state.showPetsMatched ? (
              <TouchableHighlight
                style={styles.mapButton}
                onPress={() => {
                  this.confirmReport(this.state.report);
                }}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="alert-circle" size={24} color="black" />{" "}
                  Confirm report{" "}
                </Text>
              </TouchableHighlight>
            ) : null}

            {this.state.showPetsMatchedSeen ? (
              <TouchableHighlight
                style={styles.mapButton}
                onPress={() => {
                  this.confirmReportSeen(this.state.report);
                }}
                underlayColor={"rgb(200,200,200)"}
              >
                <Text style={{ textAlign: "center" }}>
                  <Feather name="alert-circle" size={24} color="black" /> Send
                  report
                </Text>
              </TouchableHighlight>
            ) : null}

            {this.state.showPetsMatched || this.state.showPetsMatchedSeen ? (
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={false}
                onRefresh={() => {
                  this.loadInfo();
                }}
              />
            }
          >
            <View style={styles.myPlacesContainer}>
              <View style={styles.buttons}>
                {this.state.showLostPets ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.reportLoss();
                    }}
                    style={[styles.button, { backgroundColor: "#f8ad9d" }]}
                  >
                    <Feather name="alert-triangle" size={24} color="white" />
                    <Text style={[styles.buttonText]}>Report Loss </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.showLostPets ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showLostPets: false,
                        showLostPetsSeen: true,
                      });
                    }}
                    style={[styles.button, { backgroundColor: "#b5e48c" }]}
                  >
                    <Feather
                      name="arrow-right-circle"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Go to pet sights </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.showLostPetsSeen ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.reportSight();
                    }}
                    style={[styles.button, { backgroundColor: "#b5e48c" }]}
                  >
                    <Feather name="alert-circle" size={24} color="white" />
                    <Text style={styles.buttonText}>Report sight </Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.showLostPetsSeen ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        showLostPets: true,
                        showLostPetsSeen: false,
                      });
                    }}
                    style={[styles.button, { backgroundColor: "#f8ad9d" }]}
                  >
                    <Feather
                      name="arrow-right-circle"
                      size={24}
                      color="white"
                    />
                    <Text style={styles.buttonText}>Go to lost pets </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {this.state.showLostPets ? (
                <Text style={styles.title}>Lost pets</Text>
              ) : null}
              {this.state.showLostPets ? (
                <Text style={styles.text}>
                  Help other owners to find their beloved pets or report your
                  loss clicking on the "Report loss" button.
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

                {this.state.showPetsMatched ? (
                  <View>
                    <Text style={styles.title}>Matched Pets</Text>
                    <PetLostButton
                      navigation={this.props.navigation}
                      pets={this.state.lostPetsMatched}
                    ></PetLostButton>
                  </View>
                ) : null}

                {this.state.showPetsMatchedSeen ? (
                  <View>
                    <Text style={styles.title}>Matched Pets</Text>
                    <PetLostSeenButton
                      navigation={this.props.navigation}
                      pets={this.state.lostPetsMatched}
                    ></PetLostSeenButton>
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
    borderRadius: 22,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginLeft: 10,
    overflow: "hidden",
    elevation: 2,
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
    zIndex: 999,
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
