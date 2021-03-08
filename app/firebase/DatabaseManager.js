import { firestore, storage } from "./firebaseconfig.js";
import User from "./User.js";
import Animal from "./Animal.js";
import AdoptableAnimal from "./AdoptableAnimal.js";
import Place from "./Place.js";
import Feed from "./Feed.js";
import Notification from "./Notification.js";
import News from "./News.js";
import LostPetNotify from "./LostPetNotify.js";
import LostPetSeen from "./LostPetSeen.js";

const db = {
  // ----------------User-----------------------------------------------------------

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
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        user = new User(
          data.name,
          data.photo,
          data.type,
          data.address,
          data.days,
          data.lastlogin
        );
        //console.log(user);
        return user;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteUser: function (uid, type) {
    const users = firestore.collection("Users");

    this.getUserNotifications(uid).then(function (notifications) {
      if (notifications.length != 0) {
        notifications.forEach((id) => db.deleteUserNotification(uid, id));
      }

      if (type == "business") {
        users
          .doc(uid)
          .delete()
          .then(function () {
            console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      } else {
        db.getUserFeeds(uid).then(function (feeds) {
          if (feeds.length != 0) {
            feeds.forEach((id) => db.deleteUserFeed(uid, id));
          }
          db.getSavedPlaces(uid).then(function (savedplaces) {
            if (savedplaces.length != 0) {
              savedplaces.forEach((id) => db.deleteSavedPlace(uid, id));
            }
            db.getUserAnimals(uid).then(function (animals) {
              if (animals.length != 0) {
                animals.forEach((id) => db.deleteAnimal(uid, id));
              }
              users
                .doc(uid)
                .delete()
                .then(function () {
                  console.log("Document successfully deleted!");
                })
                .catch(function (error) {
                  console.error("Error removing document: ", error);
                });
            });
          });
        });
      }
    });
  },

  //--------------UserAnimal----------------------------------------

  addUserAnimal: function (uid, name, age, breed, size, photo, type) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    let animal = new Animal(name, age, breed, size, photo, type);
    console.log(type);
    animals.add(animal.toFirestore());
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

  addAnimalStat: function (uid, aid) {
    const users = firestore.collection("Users");
    const stats = users
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .collection("Stats");
    stats.add({ name: stat });
  },

  addAnimalStatSample: function (uid, aid, stat, value) {
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
          //console.log(doc.id, " => ", doc.data());
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
        //console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        //console.log(data);
        animal = new Animal(
          data.name,
          data.age,
          data.breed,
          data.size,
          data.photo,
          data.type
        );
        //console.log(user);
        return animal;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAnimalStats: function (uid, aid) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
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

  getAnimalStat: function (uid, aid, stat) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    var stat;
    return animals
      .doc(aid)
      .collection("Stats")
      .doc(stat)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        stat = doc.data().name;
        //console.log(user);
        return stat;
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
          samples.push(doc.id);
          //console.log(user);
          return samples;
        });
        return samples;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAnimalStatSample: function (uid, aid, stat, id) {
    const stats = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .collection("Stats");
    var sample;
    return stats
      .doc(stat)
      .collection("Samples")
      .doc(id)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        sample = doc.data();
        //console.log(user);
        return sample;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

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
          diseases.push(doc.id);
          //console.log(user);
          return diseases;
        });
        return diseases;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAnimalDisease: function (uid, aid, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    var disease;
    return animals
      .doc(aid)
      .collection("Diseases")
      .doc(id)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        disease = doc.data().disease;
        //console.log(user);
        return disease;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteAnimalDisease: function (uid, aid, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    animals
      .doc(aid)
      .collection("Diseases")
      .doc(id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAnimalStat: function (uid, aid, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    animals
      .doc(aid)
      .collection("Stats")
      .doc(id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAnimalStatSample: function (uid, aid, stat, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    const stats = animals.doc(aid).collection("Stats");
    stats
      .doc(stat)
      .collection("Samples")
      .doc(id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAnimal: function (uid, aid) {
    const users = firestore.collection("Users");
    this.getAnimalDiseases(uid, aid).then(function (diseases) {
      if (diseases.length != 0) {
        // diseases are optional so must be checked
        diseases.forEach((id) => db.deleteAnimalDisease(uid, aid, id));
      }
      db.getAnimalStats(uid, aid).then(function (stats) {
        if (stats.length != 0) {
          stats.forEach(function (id) {
            db.getAnimalStatSamples(uid, aid, id).then(function (samples) {
              if (samples.length != 0) {
                samples.forEach((sampleid) =>
                  db.deleteAnimalStatSample(uid, aid, id, sampleid)
                );
              }
            });
            db.deleteAnimalStat(uid, aid, id);
          });
        }
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
      });
    });
  },

  //-------------SavedPlaces--------------------------------

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
          console.log(doc.id, " => ", doc.data());
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
        console.log(doc.id, " => ", doc.data());
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

  //----------------------Places----------------------------------------------------------

  addAdoptableAnimal: function (
    pid,
    name,
    age,
    breed,
    size,
    photo,
    type,
    profile
  ) {
    console.log("addAdoptableAnimal");
    const places = firestore.collection("Places");
    let animal = new AdoptableAnimal(
      name,
      age,
      breed,
      size,
      photo,
      type,
      profile
    );
    console.log(animal);
    places.doc(pid).collection("Animals").add(animal.toFirestore());
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
          data.type,
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
          diseases.push(doc.id);
          //console.log(user);
          return diseases;
        });
        return diseases;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteAdoptableAnimalDisease: function (pid, aid, id) {
    const animals = firestore
      .collection("Places")
      .doc(pid)
      .collection("Animals");
    animals
      .doc(aid)
      .collection("Diseases")
      .doc(id)
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
    this.getAdoptableAnimalDiseases(pid, aid).then(function (diseases) {
      if (diseases.length != 0) {
        // diseases are optional so must be checked
        diseases.forEach(function (id) {
          db.deleteAdoptableAnimalDisease(pid, aid, id);
        });
      }
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
    });
  },

  addPlace: function (
    name,
    type,
    description,
    photo,
    uid,
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
      uid,
      address,
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    );
    places.add(place.toFirestore());
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
        console.log("region");
        console.log(data.region);
        place = new Place(
          data.name,
          data.type,
          data.description,
          data.photo,
          data.uid,
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
          console.log(doc.id, " => ", doc.data());
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

  getPlacesByUid: function (uid) {
    const map = firestore.collection("Places");
    var places = [];
    return map
      .where("uid", "==", uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
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

  deletePlace: function (pid) {
    const places = firestore.collection("Places");

    this.getAllNews(pid).then(function (news) {
      if (news.length != 0) {
        news.forEach((newsid) => db.deleteNews(pid, newsid));
      }

      db.getAdoptableAnimals(pid).then(function (animals) {
        if (animals.length != 0) {
          animals.forEach(function (aid) {
            db.deleteAdoptableAnimal(pid, aid);
          });
        }
        console.log("deletePlace");
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

  //----------------News---------------------------------------------------

  addNews: function (pid, title, text) {
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
    const places = firestore.collection("Places");
    let news = new News(title, text, timestamp);
    places.doc(pid).collection("News").add(news.toFirestore());
  },

  getAllNews: function (pid) {
    console.log("getAllNews");
    const places = firestore.collection("Places");
    var news = [];
    return places
      .doc(pid)
      .collection("News")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          //let data = doc.data();
          //let feed = new Feed(data.title,data.text);
          news.push(doc.id);
          //console.log(news);
          //console.log(feed);
          return news;
        });
        console.log(news);
        return news;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteNews: function (pid, newsid) {
    console.log("delete news");
    const places = firestore.collection("Places");
    places
      .doc(pid)
      .collection("News")
      .doc(newsid)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  getNews: function (pid, newsid) {
    const places = firestore.collection("Places");
    var news;
    return places
      .doc(pid)
      .collection("News")
      .doc(newsid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        news = new News(data.title, data.text, data.timestamp);
        return news;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  //--------------------- Feed ------------------------------------------------------------------

  getFeedsByFilter(pet, filter, value, id) {
    const ref = firestore.collection("Feed").doc(pet).collection(filter);
    //console.log(ref);
    var feeds = [];
    return (
      ref
        .where("name", "==", value)
        .where("id", "==", id)
        .get()
        //.where("name","==",value)
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let data = doc.data();
            let feed = new Feed(data.title, data.text, filter);
            feeds.push(feed);
            return feeds;
          });
          return feeds;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        })
    );
  },

  getGeneralFeeds(id) {
    console.log("general");
    const general = firestore.collection("Feed").doc("General").collection(id);
    var feeds = [];
    return general
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          let feed = new Feed(data.title, data.text, "General");
          feeds.push(feed);
          //console.log(feed);
          return feeds;
        });
        return feeds;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  addUserFeed: function (uid, title, text, type) {
    const users = firestore.collection("Users");
    let feed = new Feed(title, text, type);
    users.doc(uid).collection("Feed").add(feed.toFirestore());
  },

  getUserFeed: function (uid, fid) {
    const users = firestore.collection("Users");
    var feed;
    return users
      .doc(uid)
      .collection("Feed")
      .doc(fid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        feed = new Feed(data.title, data.text);
        return feed;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getUserFeeds: function (uid) {
    const users = firestore.collection("Users");
    var feeds = [];
    return users
      .doc(uid)
      .collection("Feed")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          //let data = doc.data();
          //let feed = new Feed(data.title,data.text);
          feeds.push(doc.id);
          //console.log(feed);
          return feeds;
        });

        return feeds;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteUserFeed: function (uid, fid) {
    const users = firestore.collection("Users");
    users
      .doc(uid)
      .collection("Feed")
      .doc(fid)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteUserFeeds: function (uid){
    this.getUserFeeds(uid).then(function(feeds){
       if(feeds.length !=0){
         feeds.forEach((id) => db.deleteUserFeed(uid,id));
       }
    });
  },

  getAgeString: function (age) {
    var string;
    if (age < 0) {
      console.log("Age must be a positive integer");
      string = "error";
    }

    if (age <= 6 && age >= 0) string = "Young";

    if (age > 6 && age <= 12) string = "Medium";

    if (age > 12) string = "Old";

    return string;
  },

  getUserAnimalsByType: function (uid, type) {
    const users = firestore.collection("Users");
    var animals = [];
    return users
      .doc(uid)
      .collection("Animals")
      .where("type", "==", type)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          //animals.push(doc.id);

          animals.push(
            new Animal(
              data.name,
              data.age,
              data.breed,
              data.size,
              data.photo,
              data.type
            )
          );

          //console.log(user);
          return animals;
        });

        return animals;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },


  addRandomFeeds: function (animals,uid,lastlogin,days){

    var alreadyLoggedInToday = false;
    var date = new Date();
                    var day = date.getDate();
                    if (day < 10) day = "0" + day;
                    var month = date.getMonth();
                    month = month + 1;
                    if (month < 10) month = "0" + month;
                    var year = date.getFullYear();
                    var timestamp =
                      day +
                      "/" +
                      month +
                      "/" +
                      year;

    if (lastlogin != timestamp || days ==0){  // daily feed  days = 0 is the first access
       var newdays = days + 1;
       firestore.collection("Users").doc(uid).update({"lastlogin" : timestamp , "days" : newdays});
       db.deleteUserFeeds(uid);
       var id = days % 31;
       console.log(id);
       var num = 1; // num general feeds
       if (animals.length != 0 ) { //at least one animal
          types = [];
          animals.forEach(function(animal){
                    if(!types.includes(animal.type)){
                      types.push(animal.type);
                    }
          });

          var type = types[Math.floor(Math.random() * types.length)];
          db.addBreedFeeds(uid,type,id);

          type = types[Math.floor(Math.random() * types.length)];
          db.addAgeFeeds(uid,type,id);
          type = types[Math.floor(Math.random() * types.length)];
          db.addSizeFeeds(uid,type,id);

          /*
          var length = types.length;
          var existDiseases = false;
          for (let i=0; i< length; i++){
             var ind = Math.floor(Math.random() * types.length);
             type = types[ind];
             existDiseases = addDiseaseFeeds(uid,type,id);
             if(existDiseases) {break;} else {types.splice(ind,1);}
          }
          if(!existDiseases){num = 2;}*/


          num = 2;
          id = "" + id + "";
          db.addGeneralFeeds(uid,id,num);

       }
       else{
         num= 5;
         id = "" + id + ""; // general wants a string not a number
         db.addGeneralFeeds(uid,id,num);
       }
        //});
    }

  },


  addBreedFeeds: function (uid,type,id) {
    db.getUserAnimalsByType(uid,type).then(function (animals) {
      /*
      db.getUserAnimalsByType(uid, "Cat").then(function (cats) {
        var choice;
        if (dogs.length != 0 && cats.length != 0) {
          choice = Math.floor(Math.random() * 2);
        } else if (dogs.length == 0) {
          choice = 0;
        } else {
          choice = 1;
        }

        var animals;
        var type;

        if (choice == 0) {
          animals = cats;
          type = "Cat";
        } else {
          animals = dogs;
          type = "Dog";
        }

        console.log("Type:"); */
        console.log(type);
        console.log(animals);

        var breeds = [];
        animals.forEach(function (animal) {
          if (!breeds.includes(animal.breed)) {
            breeds.push(animal.breed);
          }
        });

        console.log("Breeds:");
        console.log(breeds);
        console.log("Breed taken by chance:");
        var breed = breeds[Math.floor(Math.random() * breeds.length)];
        //console.log(id);

        db.getFeedsByFilter(type, "Breed", breed, id).then(function (feeds) {
          console.log("Breed feeds:");
          console.log(feeds);
          feeds.forEach(function (feed) {
            db.addUserFeed(uid, feed.title, feed.text, feed.type);
            console.log("Feed loaded successfully!!: " + feed.title);
          });
        });
      });
  },


  addAgeFeeds: function (uid,type, id) {
      db.getUserAnimalsByType(uid,type).then(function (animals) {

          console.log("Type:");
          console.log(type);
          console.log(animals);

          var ages = [];
          animals.forEach(function (animal) {
            var age = db.getAgeString(animal.age);
            if (!ages.includes(age)) {
              ages.push(age);
            }
          });

          console.log("Ages:");
          console.log(ages);
          console.log("Age taken by chance:");
          var age = ages[Math.floor(Math.random() * ages.length)];
          //console.log(id);

          db.getFeedsByFilter(type, "Age", age, id).then(function (feeds) {
            console.log("Age feeds:");
            console.log(feeds);
            feeds.forEach(function (feed) {
              db.addUserFeed(uid, feed.title, feed.text, feed.type);
              console.log("Feed loaded successfully!!: " + feed.title);
            });
          });
        });
    },

    addSizeFeeds: function (uid,type, id) {
          db.getUserAnimalsByType(uid,type).then(function (animals) {

              console.log("Type:");
              console.log(type);
              console.log(animals);

              var sizes = [];
              animals.forEach(function (animal) {
                if (!sizes.includes(animal.size)) {
                  sizes.push(animal.size);
                }
              });

              console.log("Sizes:");
              console.log(sizes);
              console.log("Sizes taken by chance:");
              var size = sizes[Math.floor(Math.random() * sizes.length)];
              //console.log(id);

              db.getFeedsByFilter(type, "Size", size, id).then(function (feeds) {
                console.log("Size feeds:");
                console.log(feeds);
                feeds.forEach(function (feed) {
                  db.addUserFeed(uid, feed.title, feed.text, feed.type);
                  console.log("Feed loaded successfully!!: " + feed.title);
                });
              });
            });
        },



    addGeneralFeeds: function (uid,id,num) {
                  db.getGeneralFeeds(id).then(function (feeds) {
                    console.log("General feeds:");
                    console.log(feeds);
                    for (let i=0; i<num; i++){
                      var ind = Math.floor(Math.random() * feeds.length)
                      var feed = feeds[ind];
                      feeds.splice(ind,1);
                      db.addUserFeed(uid, feed.title, feed.text, feed.type);
                      console.log("Feed loaded successfully!!: " + feed.title);
                    };
                  });
            },

  //-------------------------Notifications-----------------------------------------------------------------------

  addUserNotification: function (uid, title, text) {
    const users = firestore.collection("Users");
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
    let notification = new Notification(title, text, timestamp);
    users.doc(uid).collection("Notifications").add(notification.toFirestore());
  },

  getUserNotifications: function (uid) {
    const users = firestore.collection("Users");
    var notifications = [];
    return users
      .doc(uid)
      .collection("Notifications")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
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

  getUserNotification: function (uid, nid) {
    const users = firestore.collection("Users");
    var notification;
    return users
      .doc(uid)
      .collection("Notifications")
      .doc(nid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        notification = new Notification(
          data.title,
          data.text,
          data.notification
        );
        return notification;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteUserNotification: function (uid, nid) {
    const users = firestore.collection("Users");
    users
      .doc(uid)
      .collection("Notifications")
      .doc(nid)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

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
    phone
  ) {
    const lostPets = firestore.collection("LostPetNotify");
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
    let notification = new LostPetNotify(
      name,
      photo,
      size,
      color,
      breed,
      notes,
      place,
      timestamp,
      uid,
      email,
      phone
    );
    lostPets.add(notification.toFirestore());
  },

  getLostPetNotifications: function () {
    const lostPets = firestore.collection("LostPetNotify");
    var notifications = [];
    return lostPets
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
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

  getLostPetNotification: function (lid) {
    const lostPets = firestore.collection("LostPetNotify");
    var notification;
    return lostPets
      .doc(lid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
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
          data.phone
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
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
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
    phone
  ) {
    const lostPets = firestore.collection("LostPetSeen");
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
    let notification = new LostPetSeen(
      photo,
      size,
      color,
      breed,
      notes,
      place,
      timestamp,
      uid,
      email,
      phone
    );
    lostPets.add(notification.toFirestore());
  },

  getLostPetsSeen: function () {
    const lostPets = firestore.collection("LostPetSeen");
    var notifications = [];
    return lostPets
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
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

  getLostPetSeen: function (lid) {
    const lostPets = firestore.collection("LostPetSeen");
    var notification;
    return lostPets
      .doc(lid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        notification = new LostPetSeen(
          data.size,
          data.color,
          data.breed,
          data.notes,
          data.place,
          data.timestamp,
          data.uid,
          data.email,
          data.phone
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
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
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

    var urlToStore;
    // Upload file and metadata
    return storageRef
      .child("images/" + filename)
      .put(file, metadata)
      .then(() => {
        return db.fromStorage(filename).then((url) => {
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
