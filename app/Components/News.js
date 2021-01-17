import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  View,
} from "react-native";
import db from "../firebase/DatabaseManager";
import { AuthContext } from "./AuthContext";

class News extends React.Component {
  static contextType = AuthContext;

  state = {
    news: null,
    mounted: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  deleteNews() {}

  componentDidUpdate() {
    if (this.state.news == null && this.state.mounted) {
      const pid = this.props.pid;
      const news = this.props.news;

      var newsContainers = [];

      news.map((newsID) => {
        db.getNews(pid, newsID).then((news) => {
          newsContainers.push(
            <View key={newsID} style={styles.feedContainer}>
              <View style={styles.feed}>
                <Text style={styles.newsTitle}>{news.getTitle()}</Text>
                <Text>{news.getText()}</Text>
                <Text style={styles.newsTime}>{news.getTimestamp()}</Text>
              </View>
            </View>
          );
          if (this.state.mounted) {
            this.setState({ news: newsContainers });
          }
        });
      });
    }
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.news != null) {
      return this.state.news;
    } else {
      return <Text style={{ textAlign: "center" }}>No news</Text>;
    }
  }
}

const styles = StyleSheet.create({
  feedContainer: {
    width: "95%",
    paddingBottom: 20,
    alignSelf: "center",
  },
  newsTitle: {
    fontWeight: "bold",
  },
  newsTime: {
    fontStyle: "italic",
  },
  feed: {
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
export default News;