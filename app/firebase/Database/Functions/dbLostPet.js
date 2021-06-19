import { firestore } from "../../FirebaseConfig.js";
import LostPetNotify from "../objects/LostPetNotify.js";
import LostPetSeen from "../objects/LostPetSeen.js";
import utils from "../../../shared/Utilities.js";

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
      });
  },

  deleteLostPetNotification: function (lid) {
    const lostPets = firestore.collection("LostPetNotify");
    lostPets
      .doc(lid)
      .delete()
      .then(function () {
      })
      .catch(function (error) {
      });
  },

  deleteLostPetNotificationByUid: function (uid) {
    const lostPets = firestore.collection("LostPetNotify");
    const query = lostPets.where("uid", "==", uid);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
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
      });
  },

  deleteLostPetSeen: function (lid) {
    const lostPets = firestore.collection("LostPetSeen");
    lostPets
      .doc(lid)
      .delete()
      .then(function () {
      })
      .catch(function (error) {
      });
  },

  deleteLostPetSeenByUid: function (uid) {
    const lostPets = firestore.collection("LostPetSeen");
    const query = lostPets.where("uid", "==", uid);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  },

  //----------------------------LOST PET MATCH-----------------------------

  getLostPetsMatched: function (pet) {
    var notifications = [];
    return firestore
      .collection(pet.getCollection())
      .where("size", "==", pet.getSize())
      .where("breed", "==", pet.getBreed())
      .where("color", "==", pet.getColor())
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
};

export default dbLostPet;
