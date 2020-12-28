import { firestore, storage } from "./firebaseconfig.js";
import User from "./User.js";
import UserAnimal from "./UserAnimal.js";
import AdoptableAnimal from "./AdoptableAnimal.js";

const db = {
  addUser: function (uid, name, photo, type, address) {
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address);
    users.doc(uid).set(user.toFirestore());
  },

  getUser: function (name) {
    const users = firestore.collection("Users");
    var user;
    return users
      .where("name", "==", name)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let data = doc.data();
          user = new User(data.name, data.password, data.photo);
          console.log("userFromDbInside");
          console.log(user);
          //console.log(user);
          return user;
        });
        return user;
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

    const animals = firestore.collection("Animals");
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
    animals.doc(uid).collection("useranimals").doc().set(animal.toFirestore());
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
    const animals = firestore.collection("Animals");
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
    animals
      .doc(uid)
      .collection("adoptableanimals")
      .doc()
      .set(animal.toFirestore());
  },

  /*
   getUser : function(uid){
              console.log("getUser");
              const users = firestore.collection('Users');
              users.where("name","==","matteo").get().then(function(querySnapshot) {
                     querySnapshot.forEach(function(doc) {
                         console.log(doc.data());
                     });
              })
              .catch(function(error) {
                      console.log("Error getting documents: ", error);
              });
   },
   */
  toStorage: function (file) {
    //Reference to firebase storage
    storageRef = storage.ref();

    // Create the file metadata
    var metadata = {
      contentType: "image/jpeg",
    };

    //Create a filename
    let date = new Date().getTime();
    let user = "Matteo";
    let filename = user + date;

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
