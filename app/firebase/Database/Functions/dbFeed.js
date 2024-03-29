import {firestore} from "../../FirebaseConfig.js";
import Feed from "../objects/Feed.js";
import UserAnimal from "../objects/UserAnimal.js";
import utils from "../../../shared/Utilities.js";

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
            let feed = new Feed(data.title, data.text, filter);
            feeds.push(feed);
            return feeds;
          });
          return feeds;

        })
        .catch(function (error) {
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
          let feed = new Feed(data.title, data.text, "General");
          feeds.push(feed);
          return feeds;
        });
        return feeds;
      })
      .catch(function (error) {
      });
  },


  addUserFeed: function (uid, title, text, type) {
    const users = firestore.collection("Users");
    let feed = new Feed(title, text, type);
    users.doc(uid).collection("Feed").add(feed.toFirestore());
  },

  addFeedToGeneral: function (id, title, text) {
    const feeds = firestore.collection("Feed").doc("General");
    let feed = {
      title: title,
      text: text,
      type: "General",
     };  
    feeds.collection(id).add(feed);
  },

  addPetFeed: function (pet, type, id,name,title, text) {
    const feeds = firestore.collection("Feed").doc(pet);
    let feed = 
    {id: Number(id),
     name: name,
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
        let data = doc.data();
        feed = new Feed(data.title, data.text, data.type);
        return feed;
      })
      .catch(function (error) {
      });
  },

  getUserFeedsIds: function (uid) {
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
          let feed = doc.data()
          feeds.push(new Feed(feed.title,feed.text,feed.type));
          return feeds;
        });

        return feeds;
      })
      .catch(function (error) {
      });
  },

  deleteUserFeed: function (uid, fid) {
    const users = firestore.collection("Users");
    return users
      .doc(uid)
      .collection("Feed")
      .doc(fid)
      .delete()
      .then(function () {
      })
      .catch(function (error) {
      });
  },

  deleteUserFeeds: function (uid) {
     var promisesFeeds;
     return dbFeed.getUserFeedsIds(uid).then(function (feeds) {
        if (feeds.length != 0) {
          promisesFeeds = feeds.forEach((id) =>{return dbFeed.deleteUserFeed(uid, id)});
        }
        return promisesFeeds;
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
      });
  },

  filterAnimals(arr){
  
  filtered = [];
    for( var i = 0; i < arr.length; i++){ 
      if ( arr[i].breed != "None" ) { 
          filtered.push(arr[i]);
      }
  }
  return filtered;
  },

  getFeeds: function (animals, uid, lastlogin, days) {

    var feeds = [];
    if (lastlogin != utils.timestamp() || days == 0) {// daily feed  days = 0 is the first access
      var newdays = days + 1;
      firestore
        .collection("Users")
        .doc(uid)
        .update({ lastlogin: utils.timestamp(), days: newdays });

      var id = days % 2;
      var id = Number(id);
      var num = 1; // num general feeds

      let promiseDelete = dbFeed.deleteUserFeeds(uid);

      return Promise.all([promiseDelete]).then(() =>{

      if (animals.length != 0) { //at least one animal

        var types = [];  
        animals.forEach(function (animal) {  //animals included mongrels
          if (!types.includes(animal.type)) {
            types.push(animal.type);
          }
        });

        animals_F = dbFeed.filterAnimals(animals); // only purebreed animals
        if(animals_F.length!=0){ // if exists at least one purebreed animal
        var types_F = [];
        animals_F.forEach(function (animal) {
          if (!types_F.includes(animal.type)) {
            types_F.push(animal.type);
          }
        });

        var type = types_F[Math.floor(Math.random() * types_F.length)];

        let promiseBreed = dbFeed.getBreedFeed(uid,type,id); 

        num = 2;

        //}
        /*else{ //if no purebreed animals exist
          num = 3;
          var promiseBreed=[];
        } */

        type = types[Math.floor(Math.random() * types.length)];
        let promiseAge = dbFeed.getAgeFeed(uid, type, id);

         
        type = types[Math.floor(Math.random() * types.length)];
        let promiseSize = dbFeed.getSizeFeed(uid, type, id);
        
        id = id.toString(); // casts id to string
        let promiseGeneral = dbFeed.getRandomGeneralFeeds(id, num);

        return Promise.all([promiseBreed,promiseAge,promiseSize,promiseGeneral]).then((feedsFetched)=>{  
          let i = 0;
          let num_notgeneral = 5 - num;
          feedsFetched.forEach((feed)=>{
            if(i<num_notgeneral){
            dbFeed.addUserFeed(uid,feed.title,feed.text,feed.type);
            feeds.push(new Feed(feed.title,feed.text,feed.type));
            }
            else{
              for (j = 0; j < num; j++) { 
              dbFeed.addUserFeed(uid,feed[j].title,feed[j].text,feed[j].type);
              feeds.push(new Feed(feed[j].title,feed[j].text,feed[j].type));
              }
            }
            i = i + 1;
            return feeds;
          });
          return feeds;
        });
        
      }
      else{ // only mongrels pets
        num = 3;

        type = types[Math.floor(Math.random() * types.length)];
        let promiseAge = dbFeed.getAgeFeed(uid, type, id);

        type = types[Math.floor(Math.random() * types.length)];
        let promiseSize = dbFeed.getSizeFeed(uid, type, id);
        
        id = id.toString(); // casts id to string
        let promiseGeneral = dbFeed.getRandomGeneralFeeds(id, num);

        return Promise.all([promiseAge,promiseSize,promiseGeneral]).then((feedsFetched)=>{  
          let i = 0;
          let num_notgeneral = 5 - num;
          feedsFetched.forEach((feed)=>{
            if(i<num_notgeneral){
            dbFeed.addUserFeed(uid,feed.title,feed.text,feed.type);
            feeds.push(new Feed(feed.title,feed.text,feed.type));
            }
            else{
              for (j = 0; j < num; j++) { 
              dbFeed.addUserFeed(uid,feed[j].title,feed[j].text,feed[j].type);
              feeds.push(new Feed(feed[j].title,feed[j].text,feed[j].type));
              }
            }
            i = i + 1;
            return feeds;
          });
          return feeds;
        });

      }

      } else {   
        num = 5;
        id = id.toString(); // casts id to string
        let promiseGeneral = dbFeed.getRandomGeneralFeeds(id, num);
        return Promise.all([promiseGeneral]).then((feedsFetched)=>{  
          feedsFetched[0].forEach((feed)=>{
            dbFeed.addUserFeed(uid,feed.title,feed.text,feed.type);
            feeds.push(feed);
            return feeds;
          });

          return feeds;
        });
      }

     });

    } else {
      return dbFeed.getUserFeeds(uid).then((feedsFetched) => {
        feedsFetched.forEach((feed)=>{
          
          feeds.push(feed);
          return feeds;
        });
        return feeds;
    });
    }
  },

  getBreedFeed: function (uid, type, id) {

    var feed;
    return dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {
      var breeds = [];
      animals.forEach(function (animal) {
        if (!breeds.includes(animal.breed) && animal.breed!="None") {
          breeds.push(animal.breed);
        }
      });

      var breed = breeds[Math.floor(Math.random() * breeds.length)];
      return dbFeed.getFeedsByFilter(type, "Breed", breed, id).then(function (feeds) {
       feed = feeds[Math.floor(Math.random() * feeds.length)];
       feed = new Feed(feed.title,feed.text,feed.type);
       return feed;
      });
    });
  },

  getAgeFeed: function (uid, type, id) {

    var feed;

    return dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {

      var ages = [];
      animals.forEach(function (animal) {
        var age = utils.getAgeString(animal.age);

        if (!ages.includes(age)) {
          ages.push(age);
        }
      });
      
      var age = ages[Math.floor(Math.random() * ages.length)];
      

      return dbFeed.getFeedsByFilter(type, "Age", age, id).then(function (feeds) {
        feed = feeds[Math.floor(Math.random() * feeds.length)];
        feed = new Feed(feed.title,feed.text,feed.type);
        return feed;
      });
    });
  },

  getSizeFeed: function (uid, type, id) {
    return dbFeed.getUserAnimalsByType(uid, type).then(function (animals) {

      var sizes = [];
      animals.forEach(function (animal) {
        if (!sizes.includes(animal.size)) {
          sizes.push(animal.size);
        }
      });

      var size = sizes[Math.floor(Math.random() * sizes.length)];

      return dbFeed.getFeedsByFilter(type, "Size", size, id).then(function (feeds) {
        feed = feeds[Math.floor(Math.random() * feeds.length)];
        feed = new Feed(feed.title,feed.text,feed.type);
        return feed;
      });
    });
  },

  getRandomGeneralFeeds: function(id, num) {
    var feedsTarget = [];
    return dbFeed.getGeneralFeeds(id).then(function (feeds) {
      for (let i = 0; i < num; i++) {
        var ind = Math.floor(Math.random() * feeds.length);
        var feed = feeds[ind];
        feed = new Feed(feed.title,feed.text,feed.type);
        feeds.splice(ind, 1);
        feedsTarget.push(feed);
      }
      return feedsTarget;
    });
  },

};

export default dbFeed;