import { firestore } from "../../FirebaseConfig.js";
import User from "../objects/User.js";
import dbNotification from "./DbNotification.js";
import dbUserAnimal from "./DbUserAnimal.js";
import dbFeed from "./DbFeed.js";
import utils from "../../../shared/Utilities";
import dbPlace from "./DbPlace.js";

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
      });
  },

  deleteUser: function (uid, type) {
    const users = firestore.collection("Users");

    dbNotification.getUserNotifications(uid).then(function (notifications) {

      if (notifications.length != 0) {
         var promisesNotifications = notifications.forEach((id) =>{return dbNotification.deleteUserNotification(uid, id)});
      }
      dbFeed.getUserFeedsIds(uid).then(function (feeds) {
          if (feeds.length != 0) {
            var promisesFeeds = feeds.forEach((id) =>{return dbFeed.deleteUserFeed(uid, id)});
          }
          dbPlace.getSavedPlaces(uid).then(function (savedplaces) {
            if (savedplaces.length != 0) {
              var promisesSavedPlaces = savedplaces.forEach((id) => {return dbPlace.deleteSavedPlaceByPid(uid, id)});
            }
            dbUserAnimal.getUserAnimals(uid).then(function (animals) {
              if (animals.length != 0) {
                var promisesAnimals = animals.forEach((id) =>{ return dbUserAnimal.deleteAnimal(uid, id)});
              }
              if (type == "business") {
                dbPlace.getMyPlaces(uid).then(function (places) {
                  if(places.length != 0){
                    var promisesPlaces = places.forEach((id) => {
                      dbPlace.deletePlace(id);
                      return dbPlace.deleteMyPlace(uid,id)});
                  } 
              Promise.all([promisesNotifications,promisesFeeds,promisesSavedPlaces,promisesAnimals,promisesPlaces]).then(() => {   
              users
                .doc(uid)
                .delete()
                .then(function () {
                })
                .catch(function (error) {
                });
              });
              }); 
              }else{
                Promise.all([promisesNotifications,promisesFeeds,promisesSavedPlaces,promisesAnimals]).then(() => { 
                users
                .doc(uid)
                .delete()
                .then(function () {
                })
                .catch(function (error) {
                });
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
