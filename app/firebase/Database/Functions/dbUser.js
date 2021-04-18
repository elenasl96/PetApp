import { firestore } from "../../firebaseconfig.js";
import User from "../Objects/User.js";
import dbNotification from "./dbNotification.js";
import dbUserAnimal from "./dbUserAnimal.js";
import dbFeed from "./dbFeed.js";
import utils from "../../../shared/utilities";
import dbPlace from "./dbPlace.js";

const dbUser = {
  // user info
  addUser: function (uid, name, photo, type, address) {
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address, 0, utils.timestamp(), "");
    console.log(user);
    return users.doc(uid).set(user.toFirestore());
  },

  getUser: function (uid) {
    const users = firestore.collection("Users");
    var user;
    return users
      .doc(uid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        let data = doc.data();

        user = new User(
          data.name,
          data.photo,
          data.type,
          data.address,
          data.days,
          data.lastlogin,
          data.notificationtoken
        );
        //console.log(user);
        return user;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteUser: function (uid, type) {
    const users = firestore.collection("Users");

    this.getUserNotifications(uid).then(function (notifications) {
      if (notifications.length != 0) {
        notifications.forEach((id) =>
          dbNotification.deleteUserNotification(uid, id)
        );
      }

      if (type == "business") {
        users
          .doc(uid)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      } else {
        dbFeed.getUserFeeds(uid).then(function (feeds) {
          if (feeds.length != 0) {
            feeds.forEach((id) => dbFeed.deleteUserFeed(uid, id));
          }
          dbUser.getSavedPlaces(uid).then(function (savedplaces) {
            if (savedplaces.length != 0) {
              savedplaces.forEach((id) => dbUser.deleteSavedPlace(uid, id));
            }
            dbUserAnimal.getUserAnimals(uid).then(function (animals) {
              if (animals.length != 0) {
                animals.forEach((id) => dbUserAnimal.deleteAnimal(uid, id));
              }
              users
                .doc(uid)
                .delete()
                .then(function () {
                  console.log("Document successfully deleted!");
                })
                .catch(function (error) {
                  console.error("Error removing document: ", error);
                });
            });
          });
        });
      }
    });
  },

  updateUserPhoto: function (uid, url) {
    firestore.collection("Users").doc(uid).update({ photo: url });
  },
};

export default dbUser;
