import { firestore, storage } from "../firebaseconfig";
import User from "../Database/Objects/User";
import Animal from "../Database/Objects/UserAnimal";
import AdoptableAnimal from "../Database/Objects/AdoptableAnimal.js";
import Place from "../Database/Objects/Place.js";
import Feed from "../Database/Objects/Feed.js";
import Notification from "../Database/Objects/Notification.js";
import News from "../Database/Objects/News.js";
import LostPetNotify from "../Database/Objects/LostPetNotify.js";
import LostPetSeen from "../Database/Objects/LostPetSeen.js";
import utils from "../../shared/utilities";

const db = {
  // ----------------User-----------------------------------------------------------

  addUser: function (uid, name, photo, type, address) {
    const users = firestore.collection("Users");
    let user = new User(name, photo, type, address, 0, utils.timestamp(), "");
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
          data.lastlogin,
          data.notificationtoken
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

  //User notifications
  getUserToken: function (uid) {
    return firestore
      .collection("Users")
      .doc(uid)
      .get()
      .then(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        let token = doc.data().notificationtoken;
        console.log(doc.id, " => ", doc.data());
        return token;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  updateNotificationToken: function (uid, token) {
    const users = firestore.collection("Users");
    return users.doc(uid).update({
      notificationtoken: token,
    });
  },

  //--------------UserAnimal----------------------------------------

  addUserAnimal: function (uid, name, age, breed, size, color, photo, type) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    let animal = new Animal(name, age, breed, size, color, photo, type);
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
    animals.doc(aid).collection("Diseases").add({ name: disease });
  },
  /*
  addAnimalStat: function (uid, aid) {
    const users = firestore.collection("Users");
    const stats = users
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .collection("Stats");
    stats.add({ name: stat });
  },

  */

  addAnimalStatSample: function (uid, aid, stat, value) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    animals
      .doc(aid)
      .collection("Stats")
      .doc(stat)
      .collection("Samples")
      .doc(Date.now().toString())
      .set({
        //label: utils.timestamp(),
        value: value,
      });
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
          data.color,
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
  /*
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
          //console.log(doc.id, " => ", doc.data());
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
        //console.log(doc.id, " => ", doc.data());
        stat = doc.data().name;
        //console.log(user);
        return stat;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAnimalStatSampleByLabel: function (uid, aid, stat,label) {
      const users = firestore.collection("Users");
      const animals = users.doc(uid).collection("Animals");
      var sample;
      return animals
        .doc(aid)
        .collection("Stats")
        .doc(stat)
        .where("label","==",label)
        .get()
        .then(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          sample = doc.id;
          //console.log(user);
          return sample;
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    },

    deleteAnimalStatSampleByLabel: function(uid, aid, stat,label){
       getAnimalStatSampleByLabel(uid, aid, stat,label).then((id)=>{
         db.deleteAnimalStatSample(uid,aid,stat,id);
       });
    },

    */

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
          //console.log(doc.id, " => ", doc.data());
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
        //console.log(doc.id, " => ", doc.data());
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
          //console.log(doc.id, " => ", doc.data());
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
        //console.log(doc.id, " => ", doc.data());
        disease = doc.data();
        //console.log(user);
        return disease;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAnimalDiseaseByName: function (uid, aid, name) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    var diseases = [];
    return animals
      .doc(aid)
      .collection("Diseases")
      .where("name", "==", name)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          diseases.push(doc.id);
          return diseases;
        });
        return diseases;
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

  deleteAnimalDiseaseByName: function (uid, aid, name) {
    db.getAnimalDiseaseByName(uid, aid, name).then((ids) => {
      var id = ids[0];
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
    });
  },
  /*
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

  */

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
    color,
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
      color,
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
          data.color,
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
        place = new Place(
          data.name,
          data.type,
          data.description,
          data.photo,
          data.uid,
          data.address,
          data.latitude,
          data.longitude
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
    const places = firestore.collection("Places");
    let news = new News(title, text, utils.timestampAccurate());
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
            //console.log(doc.id, " => ", doc.data());
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
    //console.log("general");
    const general = firestore.collection("Feed").doc("General").collection(id);
    var feeds = [];
    return general
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
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

  addFeedToGeneral: function (id, title, text) {
    const feeds = firestore.collection("Feed").doc("General");
    let feed = new Feed(title, text, "General");
    feeds.collection(id).add(feed.toFirestore());
  },

  addPetFeed: function (pet, type, id, title, text) {
    const feeds = firestore.collection("Feed").doc(pet);
    let feed = {
      id: id,
      title: title,
      text: text,
      type: type,
    };
    feeds.collection(type).add(feed);
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
        //console.log(doc.id, " => ", doc.data());
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
          //console.log(doc.id, " => ", doc.data());
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

  deleteUserFeeds: function (uid) {
    this.getUserFeeds(uid).then(function (feeds) {
      if (feeds.length != 0) {
        feeds.forEach((id) => db.deleteUserFeed(uid, id));
      }
    });
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

  addRandomFeeds: function (animals, uid, lastlogin, days) {
    var feeds = [];
    var alreadyLoggedInToday = false;

    if (lastlogin != utils.timestamp() || days == 0) {
      // daily feed  days = 0 is the first access
      var newdays = days + 1;
      firestore
        .collection("Users")
        .doc(uid)
        .update({ lastlogin: utils.timestamp(), days: newdays });
      db.deleteUserFeeds(uid);
      var id = days % 31;
      //console.log(id);
      var num = 1; // num general feeds
      if (animals.length != 0) {
        //at least one animal

        var types = [];
        animals.forEach(function (animal) {
          if (!types.includes(animal.type)) {
            console.log("Type pet: " + animal.type);
            types.push(animal.type);
          }
        });

        //console.log("Animals: " + animals);
        //console.log("Types: " + types);
        var type = types[Math.floor(Math.random() * types.length)];
        //console.log("Breed selected: " + type);
        //console.log("The  BreedFeed selected is: "+ db.addBreedFeeds(uid,type,id));
        db.addBreedFeeds(uid, type, id);
        type = types[Math.floor(Math.random() * types.length)];
        //console.log("Age selected: " + type);
        db.addAgeFeeds(uid, type, id);
        type = types[Math.floor(Math.random() * types.length)];
        db.addSizeFeeds(uid, type, id);

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
        db.addGeneralFeeds(uid, id, num);
        //return feeds;
      } else {
        console.log("No animals, general feeds");
        num = 5;
        id = "" + id + ""; // general wants a string not a number
        db.addGeneralFeeds(uid, id, num);
        //return feeds;
      }
      //});
    } else {
      console.log("You have already logged in today!");
    }
  },

  addBreedFeeds: function (uid, type, id) {
    db.getUserAnimalsByType(uid, type).then(function (animals) {
      var breeds = [];
      animals.forEach(function (animal) {
        if (!breeds.includes(animal.breed)) {
          breeds.push(animal.breed);
        }
      });

      //console.log("Breeds:");
      //console.log(breeds);
      //console.log("Breed taken by chance:");
      var breed = breeds[Math.floor(Math.random() * breeds.length)];
      //console.log(id);

      db.getFeedsByFilter(type, "Breed", breed, id).then(function (feeds) {
        //console.log("Breed feeds:");
        //console.log(feeds);
        feeds.forEach(function (feed) {
          db.addUserFeed(uid, feed.title, feed.text, feed.type);
          console.log("Feed loaded successfully!!: " + feed.title);
        });
        return feeds;
      });
    });
  },

  addAgeFeeds: function (uid, type, id) {
    db.getUserAnimalsByType(uid, type).then(function (animals) {
      //console.log("Type:");
      //console.log(type);
      //console.log(animals);

      var ages = [];
      animals.forEach(function (animal) {
        var age = db.getAgeString(animal.age);
        if (!ages.includes(age)) {
          ages.push(age);
        }
      });

      //console.log("Ages:");
      //console.log(ages);
      //console.log("Age taken by chance:");
      var age = ages[Math.floor(Math.random() * ages.length)];
      //console.log(id);

      db.getFeedsByFilter(type, "Age", age, id).then(function (feeds) {
        //console.log("Age feeds:");
        //console.log(feeds);
        feeds.forEach(function (feed) {
          db.addUserFeed(uid, feed.title, feed.text, feed.type);
          console.log("Feed loaded successfully!!: " + feed.title);
        });
      });
    });
  },

  addSizeFeeds: function (uid, type, id) {
    db.getUserAnimalsByType(uid, type).then(function (animals) {
      //console.log("Type:");
      //console.log(type);
      //console.log(animals);

      var sizes = [];
      animals.forEach(function (animal) {
        if (!sizes.includes(animal.size)) {
          sizes.push(animal.size);
        }
      });

      //console.log("Sizes:");
      //console.log(sizes);
      //console.log("Sizes taken by chance:");
      var size = sizes[Math.floor(Math.random() * sizes.length)];
      //console.log(id);

      db.getFeedsByFilter(type, "Size", size, id).then(function (feeds) {
        //console.log("Size feeds:");
        //console.log(feeds);
        feeds.forEach(function (feed) {
          db.addUserFeed(uid, feed.title, feed.text, feed.type);
          console.log("Feed loaded successfully!!: " + feed.title);
        });
      });
    });
  },

  addGeneralFeeds: function (uid, id, num) {
    db.getGeneralFeeds(id).then(function (feeds) {
      //console.log("General feeds:");
      //console.log(feeds);
      for (let i = 0; i < num; i++) {
        var ind = Math.floor(Math.random() * feeds.length);
        var feed = feeds[ind];
        feeds.splice(ind, 1);
        db.addUserFeed(uid, feed.title, feed.text, feed.type);
        console.log("Feed loaded successfully!!: " + feed.title);
      }
    });
  },

  //-------------------------Notifications-----------------------------------------------------------------------

  addUserNotification: function (uid, title, text) {
    const users = firestore.collection("Users");
    let notification = new Notification(title, text, utils.timestampAccurate());
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

  //-----populate db-------------------

  populateDb: function () {
    console.log("populate db");
    db.addFeedToGeneral("3", "general feed", "test for a general feed");
    db.addPetFeed("Cat", "Age", "3", "feed", "a feed for cats about age");
  },

  // get disease descriptions
  getDiseaseDescription(name) {
    //console.log("Description of disease " + name);
    var ref = firestore.collection("DiseaseDescriptions");
    var descriptions = [];
    return ref
      .where("name", "==", name)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          descriptions.push(doc.data().description);
          //console.log(user);
          return descriptions;
        });
        return descriptions;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },
};

export default db;
