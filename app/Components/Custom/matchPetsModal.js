import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import dbNews from "../../firebase/Database/Functions/dbNews";
import { AuthContext } from "./AuthContext";

import mainStyle from "../../styles/mainStyle";
import PetLostButton from "../Buttons/PetLostButton";

export default class MatchPetsModal extends React.Component {
  static contextType = AuthContext;
  state = {
    title: "",
    text: "",
    errors: {}, // dict
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  addNews() {
    console.log("AddNews");
    if (this.handleValidation()) {
      console.log("Valid");
      const pid = this.props.pid;
      dbNews.addNews(pid, this.state.title, this.state.text).then(() => {
        this.props.close();
      });
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.close();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Matched Pets</Text>
              <PetLostButton
                navigation={this.props.navigation}
                pets={this.props.pets}
              ></PetLostButton>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 20,
    borderColor: "#707070",
    borderBottomWidth: 1,
    paddingBottom: 1.5,
    marginTop: 20.5,
  },

  title: {
    marginTop: 15,
    fontSize: 30,
    color: "#000",
    alignSelf: "center",
  },
  inputText: {
    height: 50,
    color: "white",
  },
  text: {
    fontSize: 17,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#F9844A",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
  },
  buttonText: {
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  error: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    width: "80%",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: "90%",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
