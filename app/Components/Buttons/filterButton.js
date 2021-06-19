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
import { AuthContext } from "../custom/ContextProvider";
import mainStyle from "../../styles/MainStyle";

export default class FilterButton extends React.Component {
  static contextType = AuthContext;

  state = {
    filterOpen: false,
    mounted: false,
  };

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
          style={[mainStyle.roundButton, styles.filter]}
        >
          <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  filter: {
    marginRight: 15,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
});
