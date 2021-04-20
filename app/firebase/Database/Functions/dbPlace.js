import { firestore } from "../../firebaseconfig.js";
import Place from "../Objects/Place.js";
import dbNews from "./dbNews";
import dbAdoptableAnimal from "./dbAdoptableAnimal";

const dbPlace = {

  addPlace: function (
    name,
    type,
    description,
    photo,
    address,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  ) {
    const places = firestore.collection("Places");
    let place = new Place(
      name,
      type,
      description,
      photo,
      address,
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    );

    return places.add(place.toFirestore())
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        dbPlace.addUserPlace(docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  },

  getPlace: function (pid) {
    const map = firestore.collection("Places");
    var place;
    return map
      .doc(pid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        //console.log("region");
        //console.log(data.region);
        place = new Place(
          data.name,
          data.type,
          data.description,
          data.photo,
          data.address,
          data.region.latitude,
          data.region.longitude,
          data.region.latitudeDelta,
          data.region.longitudeDelta
        );
        return place;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getPlaces: function () {
    // needs a range filter
    const map = firestore.collection("Places");
    var places = [];
    return map
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          places.push(doc.id);
          //console.log(user);
          return places;
        });

        return places;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },
/*
  getPlacesByUid: function (uid) {
    const map = firestore.collection("Places");
    var places = [];
    return map
      .where("uid", "==", uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          places.push(doc.id);
          //console.log(user);
          return places;
        });

        return places;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },  */

  deletePlace: function (pid) {
    const places = firestore.collection("Places");

    this.getAllNews(pid).then(function (news) {
      if (news.length != 0) {
        news.forEach((newsid) => dbNews.deleteNews(pid, newsid));
      }

      dbAdoptableAnimal.getAdoptableAnimals(pid).then(function (animals) {
        if (animals.length != 0) {
          animals.forEach(function (aid) {
            dbAdoptableAnimal.deleteAdoptableAnimal(pid, aid);
          });
        }
        //console.log("deletePlace");
        places
          .doc(pid)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
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
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          savedplaces.push(doc.id);
          //console.log(user);
          return savedplaces;
        });

        return savedplaces;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getSavedPlace: function (uid, id) {
    const users = firestore.collection("Users");
    var savedplace;
    return users
      .doc(uid)
      .collection("savedplaces")
      .doc(id)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        savedplace = doc.data().pid;
        //console.log(user);
        return savedplace;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },


  deleteSavedPlace: function (uid, id) {
    const users = firestore.collection("Users");
    users
      .doc(uid)
      .collection("savedplaces")
      .doc(id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  updatePlacePhoto: function (pid,url) {
      firestore
        .collection("Places")
        .doc(pid)
        .update({ photo: url });
    },

  addUserPlace: function (uid,pid) {
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
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            myplaces.push(doc.id);
            //console.log(user);
            return myplaces;
          });
          return myplaces;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
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
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          myplace = doc.data().pid;
          //console.log(user);
          return myplace;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },

    deleteMyPlace: function (uid, id) {
        const users = firestore.collection("Users");
        users
          .doc(uid)
          .collection("MyPlaces")
          .doc(id)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      },

   isMyPlace: function(uid,pid1){
      console.log("is my place");
      var match = false;
      return this.getMyPlaces(uid).then((ids) => {
          ids.map((id) => {
                this.getMyPlace(uid,id).then((pid2) => {
                    if(pid1 == pid2 && !match){
                        match = true;
                    }
                    return match;
                });
           return match;
          });
          console.log("is a match? " + match);
          return match;
   });

   },

};
export default dbPlace;
