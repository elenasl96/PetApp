import { firestore, storage } from "./firebaseconfig.js";
import User from "./User.js";
import Animal from "./Animal.js";
import AdoptableAnimal from "./AdoptableAnimal.js";
import Place from "./Place.js";

const db = {
  // ----------------User-----------------------------------------------------------  OK

  addUser: function (uid, name, photo, type, address) {
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address);
    users.doc(uid).set(user.toFirestore());
  },

  getUser: function (uid) {

      const users = firestore.collection("Users");
      var user;
      return users
        .doc(uid)
        .get()
        .then(function(doc) {
                     // doc.data() is never undefined for query doc snapshots
                     console.log(doc.id, " => ", doc.data());
                     let data = doc.data();
                     user = new User(data.name,data.photo,data.type,data.address);
                     //console.log(user);
                     return user;
                 })
             .catch(function(error) {
                 console.log("Error getting documents: ", error);
             });

  },

  //---------------------Animals--------------------------------------------------------------
  addUserAnimal: function (uid, aid, name, age, breed, size, photo, diseases) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    let animal = new Animal(name, age, breed, size, photo);
    console.log(animal);
    animals.doc(aid).set(animal.toFirestore());
  },
  /* how to call get from outside
  db.UserAnimals('axr4183').then(function(animals){
             console.log(animals);
          });
*/
  addAnimalDisease: function (uid, aid, disease) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    animals.doc(aid).collection("Diseases").add({ disease });
  },

  addAnimalStat: function (uid, aid, stat, value) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    var date = new Date();
    var day = date.getDate();
    if (day < 10) day = "0" + day;
    var month = date.getMonth();
    month = month + 1;
    if (month < 10) month = "0" + month;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var timestamp =
      day +
      "/" +
      month +
      "/" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    console.log(timestamp);
    animals
      .doc(aid)
      .collection("Stats")
      .doc(stat)
      .collection("Samples")
      .add({ timestamp: timestamp, value: value });
  },

  getUserAnimals: function (uid) {
    const users = firestore.collection("Users");
    var animals = [];
    return users
      .doc(uid)
      .collection("Animals")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          animals.push(doc.id);
          /*
                           animals.push(new UserAnimal(
                                 data.name,
                                 data.age,
                                 data.breed,
                                 data.size,
                                 data.photo,
                                 data.diseases,
                                 data.stats
                               ));
                           */
          //console.log(user);
          return animals;
        });

        return animals;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getUserAnimal: function (uid, aid) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    var animal;
    return animals
      .doc(aid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        animal = new Animal(
          data.name,
          data.age,
          data.breed,
          data.size,
          data.photo
        );
        //console.log(user);
        return animal;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  //------------- To be fixed

  getAnimalStats: function (uid, aid) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    var stats = [];
    return animals
      .doc(aid)
      .collection("Stats")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          stats.push(doc.id);
          //console.log(user);
          return stats;
        });
        return stats;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAnimalStatSamples: function (uid, aid, stat) {
    const stats = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .collection("Stats");
    var samples = [];
    return stats
      .doc(stat)
      .collection("Samples")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          samples.push(data);
          //console.log(user);
          return samples;
        });
        return samples;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  //-----

  getAnimalDiseases: function (uid, aid) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    var diseases = [];
    return animals
      .doc(aid)
      .collection("Diseases")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          diseases.push(data);
          //console.log(user);
          return diseases;
        });
        return diseases;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  addAdoptableAnimal: function (
    pid,
    aid,
    name,
    age,
    breed,
    size,
    photo,
    profile
  ) {
    console.log("addAdoptableAnimal");
    const places = firestore.collection("Places");
    let animal = new AdoptableAnimal(name, age, breed, size, photo, profile);
    console.log(animal);
    places.doc(pid).collection("Animals").doc(aid).set(animal.toFirestore());
  },

  getAdoptableAnimal: function (pid, aid) {
    const animals = firestore
      .collection("Places")
      .doc(pid)
      .collection("Animals");
    var animal;
    return animals
      .doc(aid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        animal = new AdoptableAnimal(
          data.name,
          data.age,
          data.breed,
          data.size,
          data.photo,
          data.profile
        );
        //console.log(user);
        return animal;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAdoptableAnimals: function (pid) {
    const places = firestore.collection("Places");
    var animals = [];
    return places
      .doc(pid)
      .collection("Animals")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          animals.push(doc.id);
          //console.log(user);
          return animals;
        });

        return animals;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  addAdoptableAnimalDisease: function (pid, aid, disease) {
    const places = firestore.collection("Places");
    const animals = places.doc(pid).collection("Animals");
    animals.doc(aid).collection("Diseases").add({ disease });
  },

  getAdoptableAnimalDiseases: function (pid, aid) {
    const animals = firestore
      .collection("Places")
      .doc(pid)
      .collection("Animals");
    var diseases = [];
    return animals
      .doc(aid)
      .collection("Diseases")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          diseases.push(data);
          //console.log(user);
          return diseases;
        });
        return diseases;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteAnimal: function (uid, aid) {
    const users = firestore.collection("Users");
    users
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAdoptableAnimal: function (pid, aid) {
    const places = firestore.collection("Places");
    places
      .doc(pid)
      .collection("Animals")
      .doc(aid)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  //----------------------Places-------------------------------------------------------------------------------------

  addPlace: function (
    pid,
    name,
    type,
    description,
    photo,
    uid,
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
      uid,
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    );
    places.doc(pid).set(place.toFirestore());
  },

  getPlace: function (pid) {
    const map = firestore.collection("Places");
    var place;
    return map
      .doc(pid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        place = new Place(
          data.name,
          data.type,
          data.description,
          data.photo,
          data.uid,
          data.latitude,
          data.longitude,
          data.latitudeDelta,
          data.longitudeDelta
        );
        //console.log(user);
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
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          places.push(
            new Place(
              data.name,
              data.type,
              data.description,
              data.photo,
              data.uid,
              data.latitude,
              data.longitude,
              data.latitudeDelta,
              data.longitudeDelta
            )
          );
          //console.log(user);
          return places;
        });

        return places;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  addSavedPlace: function (uid, pid) {
    const users = firestore.collection("Users");
    users.doc(uid).collection("savedplaces").doc().set({ pid: pid });
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
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          savedplaces.push(data.pid);
          //console.log(user);
          return savedplaces;
        });

        return savedplaces;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deletePlace: function (pid) {
    const places = firestore.collection("Places");
    places
      .doc(pid)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  //----------------News---------------------------------------------------

  addNews: function (uid, title, text) {
    var news = {};
    var date = new Date();
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.GetMinutes();
    var seconds = date.GetSeconds();
    var timestamp =
      day +
      "/" +
      month +
      "/" +
      year +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    news[timestamp] = [{ title: title, text: text }];
    //const users = firestore.collection("Users");
    //let user = new User(name, photo,'user', address);
    //users.doc(uid).collection("userprofile").doc().set(user.toFirestore());

    //work in progress.....
  },

  //----------------Photo storage------------------------------------------------------------------------------

  toStorage: function (uid, file) {
    console.log("ToStorage");
    //var urlToStore;
    //Reference to firebase storage
    storageRef = storage.ref();

    // Create the file metadata
    var metadata = {
      contentType: "image/jpeg",
    };

    //Create a filename
    let date = new Date().getTime();
    let filename = uid + date;
    var urlString;
    // Upload file and metadata
    return storageRef
      .child("images/" + filename)
      .put(file, metadata)
      .then(() => {
        var urlToStore;
        db.fromStorage(filename).then((url) => {
          urlToStore = url;
          return urlToStore;
        });
      });
    //filename must be saved for future accesses;
  },

  fromStorage: function (filename) {
    storageRef = storage.ref();
    var imageRef = storageRef.child("images/" + filename);
    return imageRef
      .getDownloadURL()
      .then(function (url) {
        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();

        console.log("url " + url);
        return url;
      })
      .catch(function (error) {
        console.log("error");
      });
  },
};

export default db;
