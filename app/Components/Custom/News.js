import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import dbNews from "../../firebase/database/functions/DbNews";
import { AuthContext } from "./AuthContext";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import EditableText from "./EditableText";


class News extends React.Component {
  static contextType = AuthContext;

  state = {
    news: [],
    mounted: false,
  };

  addNews = (doc) => {
    dbNews.getNews(this.props.placeId, doc.id).then((news) => {
      news.pid = this.props.placeId;
      news.id = doc.id;
      let updatedNews = this.state.news;
      updatedNews.push(news);
      this.setState({ news: updatedNews });
    });
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
    const isEditable = this.props.isEditable;
    if (this.state.news.length > 0) {
      //console.log("HAVE NEWS");
      //console.log(this.state.news);
      return this.state.news.map((news, index) => (
        <View key={index} style={styles.feedContainer}>
          <View style={styles.feed}>
            <View style={styles.topNews}>

              {!isEditable ? (
              <Text style={styles.newsTitle}>{news.getTitle()}</Text>)
              : (
          <EditableText text = {news.getTitle()} field = {"titlenews"} pid = {news.pid} nid = {news.id}></EditableText>)}

              <TouchableOpacity
                onPress={() => this.deleteNews(news.pid, news.id)}
              >
                <AntDesign name="close" size={22} color="black" />
              </TouchableOpacity>
            </View>
            {!isEditable ? (
              <Text >{news.getText()}</Text>)
              : (
          <EditableText text = {news.getText()} field = {"textnews"} pid = {news.pid} nid = {news.id}></EditableText>)}
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
    width: "100%",
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
