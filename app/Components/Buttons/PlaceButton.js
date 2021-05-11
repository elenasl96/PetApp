import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
  ImageBackground,
} from "react-native";
import dbPlace from "../../firebase/Database/Functions/dbPlace";
import { AuthContext } from "../AuthContext";

class PlaceButton extends React.Component {
  static contextType = AuthContext;

  state = {
    places: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  getMyPlaces(places) {
    let promises = places.map((placeID) => {
      return dbPlace.getPlace(placeID).then((place) => {
        place.id = placeID;
        return place;
      });
    });

    Promise.all(promises).then((places) => {
      if (this.state.mounted) {
        this.setState({ places: places });
      }
    });
  }

  showPlace(place) {
    if(!this.props.isSavedPlace){
        this.props.navigation.navigate("Place", {
          place: place,
          deletePlace: this.props.deletePlace,
        });
    }
    else{
        this.props.navigation.navigate("Place", {
                  place: place,
                  // no need for delete in this case
        });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {

    if (this.props.places != null) {

    if(!this.props.isSavedPlace){
      return this.props.places.map((place, index) => (
        <View key={index}>
          <TouchableHighlight
            onPress={() => this.showPlace(place)}
            style={styles.place}
          >
            <ImageBackground
              source={{ uri: place.photo }}
              style={styles.placeImage}
            >
              <View style={styles.overlay}>
                <Text style={styles.title}>{place.name}</Text>
              </View>
            </ImageBackground>
          </TouchableHighlight>
        </View>
      ));
    }else{

     return this.props.places.map((place, index) => (
             <View key={index}>
               <TouchableHighlight
                 onPress={() => this.showPlace(place)}
                 style={styles.pet}
               >
                 <ImageBackground
                   source={{ uri: place.photo }}
                   style={styles.petImage}
                 >
                   <View style={styles.overlay}>
                     <Text style={styles.title}>{place.name}</Text>
                   </View>
                 </ImageBackground>
               </TouchableHighlight>
             </View>
           ));
    }

    } else {
      return (
        <Text style={{ textAlign: "center" }}>
          Places you'll find and like in the map will appear here!
        </Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  place: {
    width: "100%",
    elevation: 2,
    marginVertical: 7,
  },
  title: {
    marginVertical: 55,
    color: "white",
    textShadowColor: "black",
    textShadowRadius: 3,
    alignSelf: "center",
    fontSize: 20,
  },
  placeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(150, 150, 150, 0.3)",
    width: "100%",
    height: "100%",
  },
  pet: {
      marginHorizontal: 10,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: "orange",
      elevation: 5,
    },
    petImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      resizeMode: "cover",
    },
});
export default PlaceButton;
