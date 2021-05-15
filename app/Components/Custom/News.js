import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import dbNews from "../../firebase/Database/Functions/dbNews";
import { AuthContext } from "../AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

class News extends React.Component {
  static contextType = AuthContext;

  state = {
    news: null,
    mounted: false,
  };

  deleteNews = (pid, newsId) => {
    //console.log(pid, newsId);
    dbNews.deleteNews(pid, newsId).then(() => {
      let updatedNews = this.state.news.filter((news) => news.id !== newsId);
      //console.log(updatedNews);
      this.setState({ news: updatedNews });
    });
  };

  componentDidMount() {
    this.setState({ mounted: true });
    const placeId = this.props.placeId;
    dbNews.getAllNews(placeId).then((newsIds) => {
      let newsPromises = newsIds.map((newsID) => {
        return dbNews.getNews(placeId, newsID).then((news) => {
          news.pid = placeId;
          news.id = newsID;
          return news;
        });
      });
      //console.log(newsPromises);
      Promise.all(newsPromises).then((news) => {
        this.setState({ news: news });
      });
    });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  render() {
    if (this.state.news && this.state.news.length > 0) {
      //console.log("HAVE NEWS");
      //console.log(this.state.news);
      return this.state.news.map((news, index) => (
        <View key={index} style={styles.feedContainer}>
          <View style={styles.feed}>
            <View style={styles.topNews}>
              <Text style={styles.newsTitle}>{news.getTitle()}</Text>
              <TouchableOpacity
                onPress={() => this.deleteNews(news.pid, news.id)}
              >
                <AntDesign name="close" size={22} color="black" />
              </TouchableOpacity>
            </View>
            <Text>{news.getText()}</Text>
            <Text style={styles.newsTime}>{news.getTimestamp()}</Text>
          </View>
        </View>
      ));
    } else {
      return <Text style={{ textAlign: "center" }}>No news</Text>;
    }
  }
}

const styles = StyleSheet.create({
  feedContainer: {
    width: "97%",
    paddingBottom: 20,
    alignSelf: "center",
  },
  topNews: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
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
