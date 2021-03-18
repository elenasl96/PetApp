import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import firebase from "firebase";
import db from "../firebase/DatabaseManager.js";
import { AuthContext } from "../Components/AuthContext";
//import Animal from "../firebase/Animal.js";

class FeedBox extends React.Component {
  state = {
    feeds: null,
    mounted: true,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    //console.log("IN BOX");
    const feeds = this.props.feeds;

    let promises = feeds.map((feedID, index) => {
      return db.getUserFeed(this.props.uid, feedID).then((feed) => {
        return (
          <View key={index} style={styles.feed}>
            <Text>{feed.getTitle()}</Text>
            <Text>{feed.getText()}</Text>
          </View>
        );
      });
    });

    Promise.all(promises).then((feeds) => {
      //console.log("FEEDS");
      //console.log(feeds);
      if (this.state.mounted) {
        this.setState({ feeds: feeds });
      }
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    //console.log("F");
    if (this.state.mounted) {
      return this.state.feeds;
    }
  }
}

const styles = StyleSheet.create({
  feed: {
    width: 300,
    height: 250,
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
});

export default FeedBox;
