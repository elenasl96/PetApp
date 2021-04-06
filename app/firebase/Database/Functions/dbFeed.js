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
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          let data = doc.data();
          //animals.push(doc.id);

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
      dbFeed.deleteUserFeeds(uid);
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
        dbFeed.addBreedFeeds(uid, type, id);
        type = types[Math.floor(Math.random() * types.length)];
        //console.log("Age selected: " + type);
        dbFeed.addAgeFeeds(uid, type, id);
        type = types[Math.floor(Math.random() * types.length)];
        dbFeed.addSizeFeeds(uid, type, id);

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
        dbFeed.addGeneralFeeds(uid, id, num);
        //return feeds;
      } else {
        console.log("No animals, general feeds");
        num = 5;
        id = "" + id + ""; // general wants a string not a number
        dbFeed.addGeneralFeeds(uid, id, num);
        //return feeds;
      }
      //});
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

      //console.log("Breeds:");
      //console.log(breeds);
      //console.log("Breed taken by chance:");
      var breed = breeds[Math.floor(Math.random() * breeds.length)];
      //console.log(id);

      dbFeed.getFeedsByFilter(type, "Breed", breed, id).then(function (feeds) {
        //console.log("Breed feeds:");
        //console.log(feeds);
        feeds.forEach(function (feed) {
          dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
          console.log("Feed loaded successfully!!: " + feed.title);
        });
        return feeds;
      });
    });
  },

  addAgeFeeds: function (uid, type, id) {
    dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {
      //console.log("Type:");
      //console.log(type);
      //console.log(animals);

      var ages = [];
      animals.forEach(function (animal) {
        var age = utils.getAgeString(animal.age);
        if (!ages.includes(age)) {
          ages.push(age);
        }
      });

      //console.log("Ages:");
      //console.log(ages);
      //console.log("Age taken by chance:");
      var age = ages[Math.floor(Math.random() * ages.length)];
      //console.log(id);

      dbFeed.getFeedsByFilter(type, "Age", age, id).then(function (feeds) {
        //console.log("Age feeds:");
        //console.log(feeds);
        feeds.forEach(function (feed) {
          dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
          console.log("Feed loaded successfully!!: " + feed.title);
        });
      });
    });
  },

  addSizeFeeds: function (uid, type, id) {
    dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {
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

      dbFeed.getFeedsByFilter(type, "Size", size, id).then(function (feeds) {
        //console.log("Size feeds:");
        //console.log(feeds);
        feeds.forEach(function (feed) {
          dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
          console.log("Feed loaded successfully!!: " + feed.title);
        });
      });
    });
  },

  addGeneralFeeds: function (uid, id, num) {
    dbFeed.getGeneralFeeds(id).then(function (feeds) {
      //console.log("General feeds:");
      //console.log(feeds);
      for (let i = 0; i < num; i++) {
        var ind = Math.floor(Math.random() * feeds.length);
        var feed = feeds[ind];
        feeds.splice(ind, 1);
        dbFeed.addUserFeed(uid, feed.title, feed.text, feed.type);
        console.log("Feed loaded successfully!!: " + feed.title);
      }
    });
  },
};
export default dbFeed;