import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import dbPlace from "../../firebase/Database/Functions/dbPlace";
import { AuthContext } from "../Custom/AuthContext";

class StarButton extends React.Component {
  static contextType = AuthContext;

  state = {
    favorite: false,
    mounted: false,
  };

  constructor(props) {
    super(props);
    dbPlace.getSavedPlaces(this.props.uid).then((savedPlaces) => {
      savedPlaces.forEach((savedPlaceId) => {
        if (this.props.pid == savedPlaceId) {
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
    this.setState({ favorite: true });
    this.context.addFavouritePlace(this.props.pid);
  };

  deleteFromFavorite = () => {
    dbPlace.deleteSavedPlace(this.props.uid, this.props.pid).then(() => {
      this.setState({ favorite: false });
      this.context.deleteFavouritePlace(this.props.pid);
    });
  };

  render() {
    if (this.state.favorite) {
      return (
        <TouchableOpacity
          testID="StarButton.deleteFromFavorite"
          onPress={() => this.deleteFromFavorite()}
          
        >
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
        <TouchableOpacity
          testID="StarButton.addFavorite"
          id="button_fav"
          onPress={() => this.addToFavorite()}
        >
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
