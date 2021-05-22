import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import dbFeed from "../../firebase/Database/Functions/dbFeed";
import mainStyle from "../../styles/mainStyle.js";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

class FeedBox extends React.Component {
  state = {
    feeds: null,
    mounted: true,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    const feeds = this.props.feeds;

    let promises = feeds.map((feedID, index) => {
      return dbFeed.getUserFeed(this.props.uid, feedID).then((feed) => {
        return (
          <LinearGradient
            key={index}
            style={styles.feed}
            // Background Linear Gradient
            //colors={["#caf0f8", "#48cae4", "#00b4d8"]}
            colors={["#fff", feed.getColor(), feed.getColor()]}
            start={{ x: 0.8, y: 0 }}
            locations={[0, 0.5, 1]}
          >
            <View style={styles.header}>
              <Text style={mainStyle.title}>{feed.getTitle()}</Text>
              {feed.getIcon()}
            </View>
            <Text style={mainStyle.text}>{feed.getText()}</Text>
          </LinearGradient>
        );
      });
    });

    Promise.all(promises).then((feeds) => {
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
    backgroundColor: "#caf0f8",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
    elevation: 2,
    marginVertical: 5,
  },
  petImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    resizeMode: "cover",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default FeedBox;
