import {firestore} from "../../FirebaseConfig.js";
import Notification from "../objects/Notification.js";
import utils from "../../../shared/Utilities";

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
          let data = doc.data();
          notification = new Notification(
            data.title,
            data.text,
            data.notification
          );
          return notification;
        })
        .catch(function (error) {
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
        })
        .catch(function (error) {
        });
    },

      getUserToken: function (uid) {
        return firestore
          .collection("Users")
          .doc(uid)
          .get()
          .then(function (doc) {
            let token = doc.data().notificationtoken;
            return token;
          })
          .catch(function (error) {
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