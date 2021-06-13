import React from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import dbPlace from "../../firebase/Database/Functions/dbPlace";
import { AuthContext } from "../AuthContext";
import mainStyle from "../../styles/mainStyle";

export default class FilterButton extends React.Component {
  static contextType = AuthContext;

  state = {
    filterOpen: false,
    mounted: false,
  };

  /* constructor(props) {
    super(props);

  }*/

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  showFilterModal = () => {
    if (this.state.mounted) {
      this.setState({ filterOpen: !this.state.filterOpen });
    }
  };

  orderByDistance = () => {
    this.props.orderByDistance();
    this.showFilterModal();
  };

  orderByNewest = () => {
    this.props.orderByNewest();
    this.showFilterModal();
  };

  render() {
    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.filterOpen}
          onRequestClose={() => {
            this.showFilterModal();
          }}
        >
          <View style={mainStyle.centeredView}>
            <View style={[mainStyle.modalView, { width: 200 }]}>
              <ScrollView
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.title}>Order by</Text>
                <TouchableOpacity
                  style={mainStyle.roundButton}
                  onPress={() => this.orderByDistance()}
                >
                  <Text>Distance </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={mainStyle.roundButton}
                  onPress={() => this.orderByNewest()}
                >
                  <Text>Newest </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => this.showFilterModal()}
          style={mainStyle.roundButton}
        >
          <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
});
