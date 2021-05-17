import {firestore} from "../../firebaseconfig.js";
import Notification from "../Objects/Notification.js";
import utils from "../../../shared/utilities";

const dbNotification = {
  addUserNotification: function (uid, title, text) {
      const users = firestore.collection("Users");
      let notification = new Notification(title, text, utils.timestampAccurate());
      users.doc(uid).collection("Notifications").add(notification.toFirestore());
    },

    getUserNotifications: function (uid) {
      const users = firestore.collection("Users");
      var notifications = [];
      return users
        .doc(uid)
        .collection("Notifications")
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            notifications.push(doc.id);
            return notifications;
          });
          return notifications;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },

    getUserNotification: function (uid, nid) {
      const users = firestore.collection("Users");
      var notification;
      return users
        .doc(uid)
        .collection("Notifications")
        .doc(nid)
        .get()
        .then(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          notification = new Notification(
            data.title,
            data.text,
            data.notification
          );
          return notification;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },

    deleteUserNotification: function (uid, nid) {
      const users = firestore.collection("Users");
      return users
        .doc(uid)
        .collection("Notifications")
        .doc(nid)
        .delete()
        .then(function () {
         // console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    },

      getUserToken: function (uid) {
        return firestore
          .collection("Users")
          .doc(uid)
          .get()
          .then(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            let token = doc.data().notificationtoken;
            //console.log(doc.id, " => ", doc.data());
            return token;
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
      },

      updateNotificationToken: function (uid, token) {
        const users = firestore.collection("Users");
        return users.doc(uid).update({
          notificationtoken: token,
        });
      },
};
export default dbNotification;