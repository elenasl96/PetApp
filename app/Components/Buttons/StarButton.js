import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import dbUser from "../../firebase/Database/Functions/dbUser";
import { AuthContext } from "../AuthContext";

class StarButton extends React.Component {
  static contextType = AuthContext;

  state = {
    favorite: false,
    id: undefined,
    mounted: false,
  };

  constructor(props) {
    super(props);
    dbUser.getSavedPlaces(this.props.uid).then((savedPlaces) => {
      savedPlaces.forEach((savedPlaceId) => {
        dbUser.getSavedPlace(this.props.uid, savedPlaceId).then((place) => {
          if (this.props.pid == place) {
            this.setState({ id: savedPlaceId });
            this.setState({ favorite: true });
          }
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
    dbUser.addSavedPlace(this.props.uid, this.props.pid);
    console.log("save place: " + this.props.pid);
    this.setState({ favorite: true });
  }

  deleteFromFavorite() {
    dbUser.deleteSavedPlace(this.props.uid, this.state.id);
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
