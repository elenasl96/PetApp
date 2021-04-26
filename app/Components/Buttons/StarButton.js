import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import dbPlace from "../../firebase/Database/Functions/dbPlace";
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
    console.log("STAR");
    console.log(this.props.pid);
    dbPlace.getSavedPlaces(this.props.uid).then((savedPlaces) => {
      savedPlaces.forEach((savedPlaceId) => {
        if (this.props.pid == savedPlaceId) {
          this.setState({ id: savedPlaceId });
          this.setState({ favorite: true });
        }
      });
    });
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  addToFavorite = () => {
    dbPlace.addSavedPlace(this.props.uid, this.props.pid);
    console.log("save place: " + this.props.pid);
    this.setState({ favorite: true });
    this.context.savedPlaces.push(this.props.pid);
    this.context.saveFavouritePlaces(this.context.savedPlaces);
    console.log(this.context.savedPlaces);
  };

  deleteFromFavorite = () => {
    dbPlace.deleteSavedPlace(this.props.uid, this.state.id);
    let index = this.context.savedPlaces.indexOf(this.state.id);
    if (index != -1) {
      this.context.savedPlaces.splice(index, 1);
    }
    this.context.saveFavouritePlaces(this.context.savedPlaces);
    this.setState({ favorite: false });
  };

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
