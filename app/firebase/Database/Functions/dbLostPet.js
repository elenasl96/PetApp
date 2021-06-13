import { firestore } from "../../firebaseconfig.js";
import LostPetNotify from "../Objects/LostPetNotify.js";
import LostPetSeen from "../Objects/LostPetSeen.js";
import utils from "../../../shared/utilities.js";

const dbLostPet = {
  //-----------------------------Lost Pets Notify ------------------------------

  addLostPetNotify: function (
    name,
    photo,
    size,
    color,
    breed,
    notes,
    place,
    uid,
    email,
    phone,
    latitude,
    longitude
  ) {
    const lostPets = firestore.collection("LostPetNotify");
    let notification = new LostPetNotify(
      name,
      photo,
      size,
      color,
      breed,
      notes,
      place,
      utils.timestampAccurate(),
      uid,
      email,
      phone,
      latitude,
      longitude
    );
    return lostPets.add(notification.toFirestore());
  },

  getLostPetNotifications: function () {
    const lostPets = firestore.collection("LostPetNotify");
    var notifications = [];
    return lostPets
      .orderBy("timestamp", "desc")
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

  getLostPetNotificationsByUid: function (uid) {
    const lostPets = firestore.collection("LostPetNotify");
    var notifications = [];
    return lostPets
      .where("uid", "==", uid)
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

  getLostPetNotification: function (lid) {
    const lostPets = firestore.collection("LostPetNotify");
    var notification;
    return lostPets
      .doc(lid)
      .get()
      .then(function (doc) {
        let data = doc.data();
        notification = new LostPetNotify(
          data.name,
          data.photo,
          data.size,
          data.color,
          data.breed,
          data.notes,
          data.place,
          data.timestamp,
          data.uid,
          data.email,
          data.phone,
          data.latitude,
          data.longitude
        );
        return notification;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteLostPetNotification: function (lid) {
    const lostPets = firestore.collection("LostPetNotify");
    lostPets
      .doc(lid)
      .delete()
      .then(function () {
        //console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteLostPetNotificationByUid: function (uid) {
    const lostPets = firestore.collection("LostPetNotify");
    const query = lostPets.where("uid", "==", uid);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        //console.log(uid);
        doc.ref.delete();
      });
    });
  },

  //-----------------------------Lost Pets Seen ------------------------------

  addLostPetSeen: function (
    photo,
    size,
    color,
    breed,
    notes,
    place,
    uid,
    email,
    phone,
    latitude,
    longitude
  ) {
    const lostPets = firestore.collection("LostPetSeen");

    let notification = new LostPetSeen(
      photo,
      size,
      color,
      breed,
      notes,
      place,
      utils.timestampAccurate(),
      uid,
      email,
      phone,
      latitude,
      longitude
    );
    return lostPets.add(notification.toFirestore());
  },

  getLostPetsSeen: function () {
    const lostPets = firestore.collection("LostPetSeen");
    var notifications = [];
    return lostPets
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

  getLostPetsSeenByUid: function (uid) {
    const lostPets = firestore.collection("LostPetSeen");
    var notifications = [];
    return lostPets
      .where("uid", "==", uid)
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

  getLostPetSeen: function (lid) {
    const lostPets = firestore.collection("LostPetSeen");
    var notification;
    return lostPets
      .doc(lid)
      .get()
      .then(function (doc) {
        let data = doc.data();
        notification = new LostPetSeen(
          data.photo,
          data.size,
          data.color,
          data.breed,
          data.notes,
          data.place,
          data.timestamp,
          data.uid,
          data.email,
          data.phone,
          data.latitude,
          data.longitude
        );
        return notification;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteLostPetSeen: function (lid) {
    const lostPets = firestore.collection("LostPetSeen");
    lostPets
      .doc(lid)
      .delete()
      .then(function () {
        //console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteLostPetSeenByUid: function (uid) {
    const lostPets = firestore.collection("LostPetSeen");
    const query = lostPets.where("uid", "==", uid);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        //console.log(uid);
        doc.ref.delete();
      });
    });
  },

  //----------------------------LOST PET MATCH-----------------------------

  getLostPetsMatched: function (pet) {
    console.log(pet.getBreed());
    var notifications = [];
    return firestore
      .collection(pet.getCollection())
      .where("size", "==", pet.getSize())
      .where("breed", "==", pet.getBreed())
      .where("color", "==", pet.getColor())
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log("DATA");
          console.log(doc.data());
          notifications.push(doc.id);
          //console.log(feed);
          return notifications;
        });
        return notifications;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },
};

export default dbLostPet;
