import {firestore} from "../../firebaseconfig.js";
import Feed from "../Objects/Feed.js";
import UserAnimal from "../Objects/UserAnimal.js";
import utils from "../../../shared/utilities.js";

const dbFeed = {
getFeedsByFilter(pet, filter, value, id) {
    const ref = firestore.collection("Feed").doc(pet).collection(filter);
    var feeds = [];
    return (
      ref
        .where("name", "==", value)
        .where("id", "==", id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            let data = doc.data();
            let feed = new Feed(data.id,data.name,data.title, data.text, filter);
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
    const general = firestore.collection("Feed").doc("General").collection(id);
    var feeds = [];
    return general
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let data = doc.data();
          let feed = new Feed(data.id,data.name,data.title, data.text, "General");
          feeds.push(feed);
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
    let feed = new Feed("","",title, text, type);
    users.doc(uid).collection("Feed").add(feed.toFirestore());
  },

  addFeedToGeneral: function (id, title, text) {
    const feeds = firestore.collection("Feed").doc("General");
    let feed = new Feed(id,"",title, text, "General");
    feeds.collection(id).add(feed.toFirestore());
  },

  addPetFeed: function (pet, type, id,name,title, text) {
    const feeds = firestore.collection("Feed").doc(pet);
    let feed = new Feed(id,name,title,text,type);
    feeds.collection(type).add(feed.toFirestore());
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
        let data = doc.data();
        feed = new Feed(data.id,data.name,data.title, data.text, data.type);
        console.log(feed);
        return feed;
      })
      .catch(function (error) {
        //console.log("Error getting documents: ", error);
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
          feeds.push(doc.id);
          return feeds;
        });

        return feeds;
      })
      .catch(function (error) {
        //console.log("Error getting documents: ", error);
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
        //console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteUserFeeds: function (uid) {
    dbFeed.getUserFeeds(uid).then(function (feeds) {
      if (feeds.length != 0) {
        feeds.forEach((id) => dbFeed.deleteUserFeed(uid, id));
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
          let data = doc.data();

          animals.push(
            new UserAnimal(
              data.name,
              data.age,
              data.breed,
              data.size,
              data.photo,
              data.type
            )
          );
          return animals;
        });

        return animals;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  addRandomFeeds: function (animals, uid, lastlogin, days) {

    console.log("ADD RANDOM FEEDS");
    if (lastlogin != utils.timestamp() || days == 0) {// daily feed  days = 0 is the first access
      var newdays = days + 1;
      firestore
        .collection("Users")
        .doc(uid)
        .update({ lastlogin: utils.timestamp(), days: newdays });
      dbFeed.deleteUserFeeds(uid);
      var id = days % 31;
      var num = 1; // num general feeds
      if (animals.length != 0) { //at least one animal
        var types = [];
        animals.forEach(function (animal) {
          if (!types.includes(animal.type)) {
            types.push(animal.type);
          }
        });
        var type = types[Math.floor(Math.random() * types.length)];
        dbFeed.addBreedFeeds(uid, type, id);
        type = types[Math.floor(Math.random() * types.length)];
        dbFeed.addAgeFeeds(uid, type, id);
        type = types[Math.floor(Math.random() * types.length)];
        dbFeed.addSizeFeeds(uid, type, id);
        id = "" + id + "";
        num = 2;
        dbFeed.addGeneralFeeds(uid, id, num);
      } else {
        num = 5;
        id = "" + id + ""; // general wants a string not a number
        dbFeed.addGeneralFeeds(uid, id, num);
      }
    } else {
      console.log("You have already logged in today!");
    }
  },

  addBreedFeeds: function (uid, type, id) {
    dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {
      var breeds = [];
      animals.forEach(function (animal) {
        if (!breeds.includes(animal.breed)) {
          breeds.push(animal.breed);
        }
      });

      var breed = breeds[Math.floor(Math.random() * breeds.length)];

      dbFeed.getFeedsByFilter(type, "Breed", breed, id).then(function (feeds) {
        feeds.forEach(function (feed) {
          dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
        });
        return feeds;
      });
    });
  },

  addAgeFeeds: function (uid, type, id) {
    dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {

      var ages = [];
      animals.forEach(function (animal) {
        var age = utils.getAgeString(animal.age);
        if (!ages.includes(age)) {
          ages.push(age);
        }
      });

      var age = ages[Math.floor(Math.random() * ages.length)];

      dbFeed.getFeedsByFilter(type, "Age", age, id).then(function (feeds) {
        feeds.forEach(function (feed) {
          dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
        });
      });
    });
  },

  addSizeFeeds: function (uid, type, id) {
    dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {

      var sizes = [];
      animals.forEach(function (animal) {
        if (!sizes.includes(animal.size)) {
          sizes.push(animal.size);
        }
      });

      var size = sizes[Math.floor(Math.random() * sizes.length)];

      dbFeed.getFeedsByFilter(type, "Size", size, id).then(function (feeds) {
        feeds.forEach(function (feed) {
          dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
        });
      });
    });
  },

  addGeneralFeeds: function (uid, id, num) {
    dbFeed.getGeneralFeeds(id).then(function (feeds) {
      for (let i = 0; i < num; i++) {
        var ind = Math.floor(Math.random() * feeds.length);
        var feed = feeds[ind];
        feeds.splice(ind, 1);
        dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
      }
    });
  },
};
export default dbFeed;