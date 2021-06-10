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
import mainStyle from "../styles/mainStyle";
import { AuthContext } from "../Components/AuthContext";
import NotifySightButton from "../Components/Buttons/NotifySightButton";
import ReportLossForm from "../Components/Forms/ReportLossForm";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import NotificationsHandler from "../Components/NotificationsHandler";
import { Entypo } from "@expo/vector-icons";

class LostPetNotifyScreen extends React.Component {
  static contextType = AuthContext;

  state = { mount: false, showReportLossForm: false };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  replyToLoss = () => {
    this.setState({ showReportLossForm: true });
  };

  render() {
    const pet = this.props.navigation.state.params.pet;
    //const isEditable = pet.uid == this.context.uid;
    const isEditable = false;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ReportLossForm
          sight={true}
          pet={pet}
          visible={this.state.showReportLossForm}
          close={() => {
            this.setState({ showReportLossForm: false });
          }}
          navigation={this.props.navigation}
        ></ReportLossForm>

        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.petContainer}>
              <View style={styles.buttons}>
                {isEditable ? (
                  <TouchableOpacity
                    style={[mainStyle.roundButton, { marginLeft: 60 }]}
                    onPress={this.deletePet}
                  >
                    <Text style={styles.buttonText}>
                      <AntDesign name="delete" size={24} color="red" />
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {!isEditable ? (
                  <TouchableOpacity
                    style={[mainStyle.roundButton, { marginLeft: 20 }]}
                    onPress={() => {
                      this.setState({ showReportLossForm: true });
                    }}
                  >
                    <Text style={styles.buttonText}>
                      <Feather name="alert-circle" size={24} color="orange" />
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <View>
                <ImageBackground
                  source={{ uri: pet.photo }}
                  style={styles.petImage}
                  imageStyle={{ borderRadius: 150 }}
                ></ImageBackground>
              </View>
              <View style={styles.petName}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {pet.name}
                </Text>
                <Ionicons
                  style={{ textAlign: "center" }}
                  name="md-paw"
                  size={24}
                  color="#f94144"
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <View style={styles.info}>
                <Text style={styles.infoTitle}>Size </Text>
                <Text style={styles.infoText}>{pet.size} </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.infoTitle}>Breed </Text>
                <Text style={styles.infoText}>{pet.breed} </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.infoTitle}>Color </Text>
                <Text style={styles.infoText}>{pet.color} </Text>
              </View>
            </View>

            <Text style={styles.title}>Lost information </Text>
            <View style={styles.placeLost}>
              <Text> {pet.place}</Text>
            </View>

            <Text style={styles.title}>Contacts</Text>
            <View style={styles.contacts}>
              <Text style={styles.textContact}>
                <Entypo name="email" size={16} color="black" /> {pet.email}
              </Text>
              <Text style={styles.textContact}>
                <Entypo name="phone" size={16} color="black" /> {pet.phone}
              </Text>
            </View>

            <Text style={styles.title}>Notes</Text>
            <View style={styles.contacts}>
              <Text>{pet.notes}</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      /*/*<SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.petContainer}>
              <View style={styles.pet}>
                <ImageBackground
                  //source={require("../../assets/images/Gioia.jpg")}
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
                    {pet.name ? pet.name : null}
                  </Text>
                </ImageBackground>
              </View>

              <View style={styles.buttons}>
                <NotifySightButton userID={pet.getUid()}></NotifySightButton>
              </View>
            </View>

            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Size</Text>
                  <Text>{pet.getSize()}</Text>
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
                  <Text>{pet.breed}</Text>
                </View>
              </TouchableHighlight>

              <TouchableHighlight>
                <View style={styles.info}>
                  <Text>Disease</Text>
                  <Text>{pet.diseases}</Text>
                </View>
              </TouchableHighlight>
            </ScrollView>

            <View style={styles.descriptionContainer}>
              <Text style={mainStyle.text}>Loss Information</Text>
              <Text>
                {pet.getPlace() +
                  "\n" +
                  pet.getTimestamp() +
                  "\n" +
                  pet.getNotes() +
                  "\n" +
                  pet.getEmail() +
                  "\n" +
                  pet.getPhone()}
              </Text>
            </View>
          </ScrollView>
        </View>
                </SafeAreaView> */
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
    paddingBottom: 10,
  },
  petButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 1)",
    overflow: "hidden",
    elevation: 2,
    marginHorizontal: 5,
    width: 70,
    height: 30,
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 10,
    marginBottom: 10,
    marginLeft: 10,
    elevation: 2,
    alignSelf: "center",
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
    justifyContent: "center",
    alignContent: "center",
    //paddingBottom: 20,
  },
  pet: {
    width: 150,
    height: 150,
    //borderRadius: 150,
    //backgroundColor: "white",
    marginLeft: 10,
    elevation: 2,
  },
  petImage: {
    width: 150,
    height: 150,
    //borderRadius: 0,
    //resizeMode: "cover",
    padding: 10,
    elevation: 2,
  },
  info: {
    //backgroundColor: "#F9C74F",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 7,
    marginRight: 5,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    elevation: 2,
  },
  infoText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  infoTitle: {
    color: "#f94144",
    fontWeight: "bold",
    textAlign: "center",
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
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
  title: {
    color: "#4cc9f0",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center",
  },
  petName: {
    alignSelf: "center",
    margin: 15,
  },
  profile: {
    paddingHorizontal: 20,
  },
  contacts: {
    //backgroundColor: "powderblue",
    // borderRadius: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  textContact: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 18,
    marginVertical: 5,
  },
  placeLost: {
    backgroundColor: "powderblue",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
});
export default LostPetNotifyScreen;
