import { firestore } from "../../FirebaseConfig.js";
import Place from "../objects/Place.js";
import dbNews from "./DbNews";
import dbAdoptableAnimal from "./DbAdoptableAnimal";

const dbPlace = {
  addPlace: function (
    name,
    type,
    description,
    photo,
    address,
    latitude,
    longitude
  ) {
    const places = firestore.collection("Places");
    let place = new Place(
      name,
      type,
      description,
      photo,
      address,
      latitude,
      longitude
    );

    var id;

    return places.add(place.toFirestore());
  },

  getPlace: function (pid) {
    const map = firestore.collection("Places");
    var place;
    return map
      .doc(pid)
      .get()
      .then(function (doc) {
        let data = doc.data();
        place = new Place(
          data.name,
          data.type,
          data.description,
          data.photo,
          data.address,
          data.latitude,
          data.longitude
        );
        return place;
      })
      .catch(function (error) {});
  },

  getPlaces: function () {
    const map = firestore.collection("Places");
    var places = [];
    return map
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          places.push(doc.id);
          return places;
        });
        return places;
      })
      .catch(function (error) {
      });
  },

  deletePlace: function (pid) {
    dbPlace.getPlace(pid).then((place) => {
      const places = firestore.collection("Places");
      dbNews.getAllNews(pid).then(function (news) {
        if (news.length != 0) {
          var promisesNews = news.forEach((newsid) => {
            return dbNews.deleteNews(pid, newsid);
          });
        }
        if (place.type == "Kennel") {
          dbAdoptableAnimal.getAdoptableAnimals(pid).then(function (animals) {
            if (animals.length != 0) {
              var promisesAnimals = animals.forEach(function (aid) {
                return dbAdoptableAnimal.deleteAdoptableAnimal(pid, aid);
              });
            }
            return Promise.all([promisesNews, promisesAnimals]).then(() => {
              return places
                .doc(pid)
                .delete()
                .then(function () {
                })
                .catch(function (error) {
                });
            });
          });
        } else {
          return Promise.all([promisesNews]).then(() => {
            places
              .doc(pid)
              .delete()
              .then(function () {
              })
              .catch(function (error) {
              });
          });
        }
      });
    });
  },

  // saved place

  addSavedPlace: function (uid, pid) {
    const users = firestore.collection("Users");
    users.doc(uid).collection("savedplaces").add({ pid: pid });
  },

  getSavedPlaces: function (uid) {
    const users = firestore.collection("Users");
    var savedplaces = [];
    return users
      .doc(uid)
      .collection("savedplaces")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          savedplaces.push(doc.data().pid);
          return savedplaces;
        });

        return savedplaces;
      })
      .catch(function (error) {
      });
  },

  deletePlaceByName: function (name) {
    const places = firestore.collection("Places");
    const query = places.where("name", "==", name);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        //doc.ref.delete();
        dbPlace.deletePlace(doc.id);
      });
    });
  },

  deleteSavedPlaceByPid: function (uid, pid) {
    const users = firestore.collection("Users");
    const query = users
      .doc(uid)
      .collection("savedplaces")
      .where("pid", "==", pid);

    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  },

  deleteSavedPlace: function (uid, id) {
    const users = firestore.collection("Users");
    return users
      .doc(uid)
      .collection("savedplaces")
      .where("pid", "==", id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      })
      .catch(function (error) {
      });
  },

  updatePlacePhoto: function (pid, url) {
    firestore.collection("Places").doc(pid).update({ photo: url });
  },

  addUserPlace: function (uid, pid) {
    const users = firestore.collection("Users");
    users.doc(uid).collection("MyPlaces").add({ pid: pid });
  },

  getMyPlaces: function (uid) {
    const users = firestore.collection("Users");
    var myplaces = [];
    return users
      .doc(uid)
      .collection("MyPlaces")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          myplaces.push(doc.data().pid);
          return myplaces;
        });
        return myplaces;
      })
      .catch(function (error) {
      });
  },

  getMyPlace: function (uid, id) {
    const users = firestore.collection("Users");
    var myplace;
    return users
      .doc(uid)
      .collection("MyPlaces")
      .doc(id)
      .get()
      .then(function (doc) {
        myplace = doc.data().pid;
        return myplace;
      })
      .catch(function (error) {
      });
  },

  deleteMyPlace: function (uid, id) {
    query = firestore
      .collection("Users")
      .doc(uid)
      .collection("MyPlaces")
      .where("pid", "==", id);
    return query.get().then(function (querySnapshot) {
      return querySnapshot.forEach(function (doc) {
        return doc.ref.delete();
      });
    });
  },

  updateDescriptionPlace: function(pid,value){

    firestore.collection("Places").doc(pid).update({ description: value });
  },

  updateAddressPlace: function(pid,value){
    firestore.collection("Places").doc(pid).update({ address: value });
  },

};
export default dbPlace;
