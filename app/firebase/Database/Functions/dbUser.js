import { firestore } from "../../firebaseconfig.js";
import User from "../Objects/User.js";
import dbNotification from "./dbNotification.js";
import dbUserAnimal from "./dbUserAnimal.js";
import dbFeed from "./dbFeed.js";
import utils from "../../../shared/utilities";
import dbPlace from "./dbPlace.js";

const dbUser = {
  // user info
  addUser: function (uid,name, photo, type, address) {
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address, 0, utils.timestamp(), "");
    return users.doc(uid).set(user.toFirestore());
  },

  getUser: function (uid) {
    const users = firestore.collection("Users");
    var user;
    return users
      .doc(uid)
      .get()
      .then(function (doc) {
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
        return user;
      })
      .catch(function (error) {
        console.log("Error getting documents");
      });
  },

  deleteUser: function (uid, type) {
    const users = firestore.collection("Users");

    dbNotification.getUserNotifications(uid).then(function (notifications) {
      if (notifications.length != 0) {
        notifications.forEach((id) =>dbNotification.deleteUserNotification(uid, id));
      }
      dbFeed.getUserFeeds(uid).then(function (feeds) {
          if (feeds.length != 0) {
            feeds.forEach((id) => dbFeed.deleteUserFeed(uid, id));
          }
          dbPlace.getSavedPlaces(uid).then(function (savedplaces) {
            if (savedplaces.length != 0) {
              savedplaces.forEach((id) => dbPlace.deleteSavedPlace(uid, id));
            }
            dbUserAnimal.getUserAnimals(uid).then(function (animals) {
              if (animals.length != 0) {
                animals.forEach((id) => dbUserAnimal.deleteAnimal(uid, id));
              }
              if (type == "business") {
                dbPlace.getMyPlaces(uid).then(function (places) {
                  if(places.length != 0){
                    places.forEach((id) => dbPlace.deleteMyPlace(uid,id));
                  } 
              users
                .doc(uid)
                .delete()
                .then(function () {
                  //console.log("Document successfully deleted!");
                })
                .catch(function (error) {
                  console.error("Error removing document: ", error);
                });
              }); 
              }else{
                users
                .doc(uid)
                .delete()
                .then(function () {
                  //console.log("Document successfully deleted!");
                })
                .catch(function (error) {
                  console.error("Error removing document: ", error);
                });
              }
            });
          });
        });
      });
  },

  updateUserPhoto: function (uid, url) {
    firestore.collection("Users").doc(uid).update({ photo: url });
  },
};

export default dbUser;
