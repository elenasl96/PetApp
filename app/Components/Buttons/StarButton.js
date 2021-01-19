import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import db from "../../firebase/DatabaseManager";
import { AuthContext } from "../AuthContext";

class StarButton extends React.Component {
  static contextType = AuthContext;

  state = {
    favorite: false,
    mounted: false,
  };

  constructor(props) {
    super(props);
    db.getSavedPlaces(this.props.uid).then((savedPlaces) => {
      savedPlaces.forEach((savedPlaceId) => {
        db.getSavedPlace(this.props.uid, savedPlaceId).then((place) => {
          if (this.props.pid == place) this.setState({ favorite: true });
        });
      });
    });
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  addToFavorite() {
    db.addSavedPlace(this.props.uid, this.props.pid);
    console.log("save place: " + this.props.pid);
    this.setState({ favorite: true });
  }

  deleteFromFavorite() {
    db.deleteSavedPlace(this.props.uid, this.props.pid);
    this.setState({ favorite: false });
  }

  render() {
    if (this.state.favorite) {
      return (
        <TouchableOpacity onPress={() => this.deleteFromFavorite()}>
          <AntDesign
            name="star"
            size={32}
            style={{ marginLeft: 10 }}
            color="orange"
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.addToFavorite()}>
          <AntDesign
            name="staro"
            size={32}
            style={{ marginLeft: 10 }}
            color="orange"
          />
        </TouchableOpacity>
      );
    }
  }
}

export default StarButton;
