import { firestore, storage } from "./firebaseconfig.js";
import User from "./User.js";
import BusinessUser from "./BusinessUser.js";
import UserAnimal from "./UserAnimal.js";
import AdoptableAnimal from "./AdoptableAnimal.js";
import Place from "./Place.js";

const db = {


// ----------------User-----------------------------------------------------------


  addUser: function (uid, name, photo, type, address) {
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address);
    users.doc(uid).collection("userprofile").doc().set(user.toFirestore());
  },

  addBusinessUser : function(uid, name, photo, type, address, pid, news){
    const users = firestore.collection("Users");
    console.log("Add businessuser");
    let user = new BusinessUser(name, photo, type, address, pid, news);
    console.log(user);
    console.log(user.getPid());
    users.doc(uid).collection("userprofile").doc().set(user.toFirestore());
  },

  getUser: function (uid) {

      const users = firestore.collection("Users");
      var user;
      return users
        .doc(uid)
        .collection("userprofile")
        .get()
        .then(function(querySnapshot) {
                 querySnapshot.forEach(function(doc) {
                     // doc.data() is never undefined for query doc snapshots
                     console.log(doc.id, " => ", doc.data());
                     let data = doc.data();
                     if (data.type == 'user')
                       user = new User(data.name,data.photo,data.type,data.address);
                     else
                       user = new BusinessUser(data.name,data.photo,data.type,data.address,data.pid,data.news)
                     //console.log(user);
                     return user;
                 });
                 return user;
             })
             .catch(function(error) {
                 console.log("Error getting documents: ", error);
             });

  },


//---------------------Animals--------------------------------------------------------------
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
  /* how to call get from outside
  db.UserAnimals('axr4183').then(function(animals){
             console.log(animals);
          });
*/
  getUserAnimals : function(uid) {
      const users = firestore.collection("Users");
            var animals = [];
            return users
              .doc(uid)
              .collection("useranimals")
              .get()
              .then(function(querySnapshot) {
                       querySnapshot.forEach(function(doc) {
                           // doc.data() is never undefined for query doc snapshots
                           console.log(doc.id, " => ", doc.data());
                           let data = doc.data();
                           animals.push(new UserAnimal(
                                 data.aid,
                                 data.name,
                                 data.age,
                                 data.breed,
                                 data.size,
                                 data.photo,
                                 data.diseases,
                                 data.stats
                               ));
                           //console.log(user);
                           return animals;
                       });

                       return animals;
                   })
                   .catch(function(error) {
                       console.log("Error getting documents: ", error);
                   });
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


  getAdoptableAnimals : function(uid) {
        const users = firestore.collection("Users");
              var animals = [];
              return users
                .doc(uid)
                .collection("adoptableanimals")
                .get()
                .then(function(querySnapshot) {
                         querySnapshot.forEach(function(doc) {
                             // doc.data() is never undefined for query doc snapshots
                             console.log(doc.id, " => ", doc.data());
                             let data = doc.data();
                             animals.push(new UserAnimal(
                                   data.aid,
                                   data.name,
                                   data.age,
                                   data.breed,
                                   data.size,
                                   data.photo,
                                   data.diseases,
                                   data.profile
                                 ));
                             //console.log(user);
                             return animals;
                         });

                         return animals;
                     })
                     .catch(function(error) {
                         console.log("Error getting documents: ", error);
                     });
  },

//----------------------Places-------------------------------------------------------------------------------------

  addPlace: function (pid,name, description, photo, uid, latitude, longitude, latitudeDelta, longitudeDelta) {
      const places = firestore.collection("Places");
      let place = new Place(name, description, photo, uid, latitude, longitude, latitudeDelta, longitudeDelta);
      places.doc(pid).set(place.toFirestore());
  },

  getPlace: function(pid){
        const map = firestore.collection("Places");
                      var place;
                      return map
                        .doc(pid)
                        .get()
                        .then(function(doc) {
                                     // doc.data() is never undefined for query doc snapshots
                                     console.log(doc.id, " => ", doc.data());
                                     let data = doc.data();
                                     place = new Place(
                                     data.name,
                                     data.description,
                                     data.photo,
                                     data.uid,
                                     data.latitude,
                                     data.longitude,
                                     data.latitudeDelta,
                                     data.longitudeDelta);
                                     //console.log(user);
                                     return place;
                          })
                             .catch(function(error) {
                                 console.log("Error getting documents: ", error);
                             });
  },

  getPlaces: function(){  // needs a range filter
      const map = firestore.collection("Places");
                    var places = [];
                    return map
                      .get()
                      .then(function(querySnapshot) {
                               querySnapshot.forEach(function(doc) {
                                   // doc.data() is never undefined for query doc snapshots
                                   console.log(doc.id, " => ", doc.data());
                                   let data = doc.data();
                                   places.push(new Place(
                                   data.name,
                                   data.description,
                                   data.photo,
                                   data.uid,
                                   data.latitude,
                                   data.longitude,
                                   data.latitudeDelta,
                                   data.longitudeDelta));
                                   //console.log(user);
                                   return places;
                               });

                               return places;
                           })
                           .catch(function(error) {
                               console.log("Error getting documents: ", error);
                           });

  },

  addSavedPlace: function (uid,pid) {
        const users = firestore.collection("Users");
        users.doc(uid).collection("savedplaces").doc().set({pid: pid,});
  },

  getSavedPlaces: function(uid){
                const users = firestore.collection("Users");
                      var savedplaces = [];
                      return users
                        .doc(uid)
                        .collection("savedplaces")
                        .get()
                        .then(function(querySnapshot) {
                                 querySnapshot.forEach(function(doc) {
                                     // doc.data() is never undefined for query doc snapshots
                                     console.log(doc.id, " => ", doc.data());
                                     let data = doc.data();
                                     savedplaces.push(data.pid);
                                     //console.log(user);
                                     return savedplaces;
                                 });

                                 return savedplaces;
                             })
                             .catch(function(error) {
                                 console.log("Error getting documents: ", error);
                             });
  },


//----------------Photo storage------------------------------------------------------------------------------

  toStorage: function (uid,file) {

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
