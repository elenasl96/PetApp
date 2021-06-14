import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "./AuthContext";

export default class LoadingOverlay extends React.Component {
  static contextType = AuthContext;

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.close();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="orange" />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 55,
    marginBottom: 55,
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignContent: "center",
    paddingVertical: 10,
    alignItems: "center",
    width: "100%",
  },
});
