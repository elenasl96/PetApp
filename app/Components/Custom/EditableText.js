import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";
import dbPlace from "../../firebase/database/functions/DbPlace";
import dbNews from "../../firebase/database/functions/DbNews";
import MainStyle from "../../styles/MainStyle";
import { AntDesign } from "@expo/vector-icons";

class EditableText extends React.Component {
  // props text

  state = {
    oldText: "",
    newText: "",
    onEditing: false,
  };

  componentDidMount() {
    this.setState({
      mounted: true,
      oldText: this.props.text,
      newText: this.props.text,
    });
  }

  handlePress() {
    if (this.state.onEditing) {
      this.saveUpdate();
    } else {
      this.setOnEditing();
    }
  }

  setOnEditing() {
    this.setState({ onEditing: true });
  }

  saveUpdate() {
    const oldText = this.state.oldText;
    const newText = this.state.newText;
    if (oldText != newText) {
      // update if there is some change
      this.setState({ oldText: newText });
      this.updateDb(newText);
    }
    this.setState({ onEditing: false });
  }

  updateDb(text) {
    const field = this.props.field;
    if (field == "address") {
      dbPlace.updateAddressPlace(this.props.pid, text);
    }
    if (field == "description") {
      dbPlace.updateDescriptionPlace(this.props.pid, text);
    }
    if (field == "profile") {
      dbAdoptableAnimal.updateAdoptablePetProfile(
        this.props.pid,
        this.props.aid,
        text
      );
    }
    if (field == "titlenews") {
      dbNews.updateNewsTitle(this.props.pid, this.props.nid, text);
    }
    if (field == "textnews") {
      dbNews.updateNewsText(this.props.pid, this.props.nid, text);
    }
  }

  render() {
    const oldText = this.state.oldText;
    const newText = this.state.newText;
    const onEditing = this.state.onEditing;
    const m1 = <AntDesign name="edit" size={15} color="black" />;
    const m2 = <AntDesign name="check" size={15} color="black" />;

    return (
      // visualizes TextInput or Text if OnEditing
      <View style={styles.editableBox}>
        {onEditing ? (
          <View style={styles.textOnChange}>
            <TextInput
              multiline
              placeholder="editable"
              placeholderTextColor="#616161"
              returnKeyType="next"
              autoFocus={true}
              value={newText}
              onChangeText={(text) => this.setState({ newText: text })}
            />
          </View>
        ) : (
          <TouchableOpacity onPress={() => this.handlePress()}>
            <Text style={styles.text}> {oldText} </Text>
          </TouchableOpacity>
        )}

        {onEditing ? (
          <TouchableOpacity
            style={[MainStyle.roundButton, { marginTop: 0, marginRight: 5 }]}
            onPress={() => this.handlePress()}
          >
            <Text style={{ fontWeight: "bold", fontFamily: "Roboto" }}>
              {m2}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  disease: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 5,
    marginBottom: 5,
    padding: 10,
    elevation: 2,
  },
  editableBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "flex-start",
  },
  text: {
    marginTop: 10,
    flexShrink: 1,
  },
  textOnChange: {
    margin: 5,
    flexShrink: 1,
  },
});
export default EditableText;
