import { firestore, storage } from "./firebaseconfig.js";
import User from "./User.js";
import UserAnimal from "./UserAnimal.js";
import AdoptableAnimal from "./AdoptableAnimal.js";

const db = {
  addUser: function (uid, name, photo, type, address) {
    console.log("addUser");
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address);
    users.doc(uid).collection("userprofile").doc().set(user.toFirestore());
  },

  getUser: function (uid) {
    const users = firestore.collection("Users");
    var user;
    return users
      .doc(uid)
      .collection("userprofile")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          user = new User(data.name, data.photo, data.type, data.address);
          //console.log(user);
          return user;
        });
        return user;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  addUserAnimal: function (
    uid,
    aid,
    name,
    age,
    breed,
    size,
    photo,
    diseases,
    stats
  ) {
    // stats must be passed in this way:
    //var stats = {};
    //stats["weight"] = [{date: '20-12-2020 10:34',value:  20 },{date: '28-12-2020 11:50',value: 20.3}];

    const users = firestore.collection("Users");
    let animal = new UserAnimal(
      aid,
      name,
      age,
      breed,
      size,
      photo,
      diseases,
      stats
    );
    console.log(animal);
    users.doc(uid).collection("useranimals").doc().set(animal.toFirestore());
  },

  addAdoptableAnimal: function (
    uid,
    aid,
    name,
    age,
    breed,
    size,
    photo,
    diseases,
    profile
  ) {
    console.log("addAdoptableAnimal");
    const users = firestore.collection("Users");
    let animal = new AdoptableAnimal(
      aid,
      name,
      age,
      breed,
      size,
      photo,
      diseases,
      profile
    );
    console.log(animal);
    users
      .doc(uid)
      .collection("adoptableanimals")
      .doc()
      .set(animal.toFirestore());
  },

  toStorage: function (uid, file) {
    //Reference to firebase storage
    storageRef = storage.ref();

    // Create the file metadata
    var metadata = {
      contentType: "image/jpeg",
    };

    //Create a filename
    let date = new Date().getTime();
    let filename = uid + date;

    // Upload file and metadata
    var uploadTask = storageRef.child("images/" + filename).put(file, metadata);
    return filename; //filename must be saved for future accesses;
  },

  fromStorage: function (filename) {
    storageRef = storage.ref();
    var imageRef = storageRef.child("images/" + filename);
    imageRef
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
        console.log(url);
        return url;
      })
      .catch(function (error) {
        console.log("error");
      });
  },
};

export default db;
