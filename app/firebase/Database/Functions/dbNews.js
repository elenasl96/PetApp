import {firestore} from "../../firebaseconfig.js";
import News from "../Objects/News.js";

const dbNews = {
  addNews: function (pid, title, text) {
      const places = firestore.collection("Places");
      let news = new News(title, text, utils.timestampAccurate());
      places.doc(pid).collection("News").add(news.toFirestore());
    },

    getAllNews: function (pid) {
      console.log("getAllNews");
      const places = firestore.collection("Places");
      var news = [];
      return places
        .doc(pid)
        .collection("News")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            //let data = doc.data();
            //let feed = new Feed(data.title,data.text);
            news.push(doc.id);
            //console.log(news);
            //console.log(feed);
            return news;
          });
          console.log(news);
          return news;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },

    deleteNews: function (pid, newsid) {
      console.log("delete news");
      const places = firestore.collection("Places");
      places
        .doc(pid)
        .collection("News")
        .doc(newsid)
        .delete()
        .then(function () {
          console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    },

    getNews: function (pid, newsid) {
      const places = firestore.collection("Places");
      var news;
      return places
        .doc(pid)
        .collection("News")
        .doc(newsid)
        .get()
        .then(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          news = new News(data.title, data.text, data.timestamp);
          return news;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },

};
export default dbNews;