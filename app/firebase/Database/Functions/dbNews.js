import utils from "../../../shared/Utilities.js";
import { firestore } from "../../FirebaseConfig.js";
import News from "../objects/News.js";

const dbNews = {
  addNews: function (pid, title, text) {
    const places = firestore.collection("Places");
    let news = new News(title, text, utils.timestampAccurate());
    return places.doc(pid).collection("News").add(news.toFirestore());
  },

  getAllNews: function (pid) {
    const places = firestore.collection("Places");
    var news = [];
    return places
      .doc(pid)
      .collection("News")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          news.push(doc.id);
          return news;
        });
        return news;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteNews: function (pid, newsid) {
    const places = firestore.collection("Places");
    return places
      .doc(pid)
      .collection("News")
      .doc(newsid)
      .delete()
      .then(function () {
        //console.log("Document successfully deleted!");
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
        let data = doc.data();
        news = new News(data.title, data.text, data.timestamp);
        return news;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  updateNewsTitle: function (pid, nid, title) {
    firestore
      .collection("Places")
      .doc(pid)
      .collection("News")
      .doc(nid)
      .update({ title: title });
  },

  updateNewsText: function (pid, nid, text) {
    firestore
      .collection("Places")
      .doc(pid)
      .collection("News")
      .doc(nid)
      .update({ text: text });
  },

};
export default dbNews;
