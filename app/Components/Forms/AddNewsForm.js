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
import { AuthContext } from "../AuthContext";
import validator from "../../shared/validation";
import mainStyle from "../../styles/mainStyle";

export default class AddNewsForm extends React.Component {
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
    let errors = validator.handleNewsValidation(
      this.state.name,
      this.state.description,
      this.state.photo,
      this.state.address,
      this.state.city
    );
    let isValid = validator.isValid(errors);
    this.setState({ errors: errors });

    if (isValid) {
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
        <View style={mainStyle.centeredView}>
          <View style={mainStyle.modalView}>
            <ScrollView
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Write news</Text>

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="Title"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  value={this.state.title}
                  onChangeText={(title) => this.setState({ title })}
                />
              </View>

              {this.state.errors["title"] != null ? (
                <Text style={styles.error}>{this.state.errors["title"]}</Text>
              ) : null}

              <View style={mainStyle.form}>
                <TextInput
                  style={mainStyle.inputText}
                  placeholder="News"
                  placeholderTextColor="#616161"
                  returnKeyType="next"
                  multiline
                  value={this.state.text}
                  onChangeText={(text) => this.setState({ text })}
                />
              </View>

              {this.state.errors["text"] != null ? (
                <Text style={styles.error}>{this.state.errors["text"]}</Text>
              ) : null}

              <TouchableOpacity
                style={{
                  width: "50%",
                  marginTop: 10,
                  marginBottom: 40,
                  alignSelf: "center",
                }}
                onPress={this.addNews.bind(this)}
              >
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Publish news</Text>
                </View>
              </TouchableOpacity>
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
});
