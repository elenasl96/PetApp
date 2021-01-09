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

  //--------------UserAnimal----------------------------------------

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

  addAnimalStat: function (uid, aid, stat){
    const users = firestore.collection("Users");
    const stats = users.doc(uid).collection("Animals").doc(aid).collection("Stats");
    stats.doc(stat).set({ stat });
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


  //-------------SavedPlaces--------------------------------


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

  getSavedPlace: function(uid,id){
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

  deleteSavedPlace: function (uid,id){
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

  deleteAdoptableAnimalDisease : function(pid,aid,id){
    const animals = firestore.collection("Places").doc(pid).collection("Animals");
    animals.doc(aid).collection("Diseases").doc(id).delete().then(function(){
    console.log("Document successfully deleted!");
    })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAdoptableAnimal: function (pid, aid) {
    const places = firestore.collection("Places");
    this.getAdoptableAnimalDiseases(pid,aid).then(function(diseases){
       if (diseases.length != 0){  // diseases are optional so must be checked
          diseases.forEach(function(id){
            db.deleteAdoptableAnimalDisease(pid,aid,id);
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


    this.getAllNews(pid).then(function(news){

    if(news.length != 0){
       news.forEach(newsid => db.deleteNews(pid,newsid));
    }

    db.getAdoptableAnimals(pid).then(function(animals){
           if (animals.length != 0){
             animals.forEach(function(aid){
                db.deleteAdoptableAnimal(pid,aid);
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

  addNews: function (pid,newsid, title, text) {
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
    let news = new News(title,text,timestamp);
    places.doc(pid).collection("News").doc(newsid).set(news.toFirestore());
  },

  getAllNews: function(pid){
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

    deleteNews:function(pid,newsid){
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

    getNews: function(pid,newsid){
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
                      news = new News(data.title,data.text,data.timestamp);
                      return news;
                    })
                  .catch(function (error) {
                    console.log("Error getting documents: ", error);
                  });
      },

  //--------------------- Feed ------------------------------------------------------------------


  getFeedsByFilter(pet,filter,value){
    const ref = firestore.collection("Feed").doc(pet).collection(filter);
    //console.log(ref);
    var feeds = [];
    return ref
            .where("name","==",value)
           .get()
           //.where("name","==",value)
           .then(function (querySnapshot) {
                       querySnapshot.forEach(function (doc) {
                         // doc.data() is never undefined for query doc snapshots
                         console.log(doc.id, " => ", doc.data());
                         let data = doc.data();
                         let feed = new Feed(data.title,data.text);
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


  getGeneralFeeds(pet){
            console.log("general");
            const general = firestore.collection("Feed").doc(pet).collection("General");
            var feeds = [];
            return general
                   .get()
                   .then(function (querySnapshot) {
                               querySnapshot.forEach(function (doc) {
                                 // doc.data() is never undefined for query doc snapshots
                                 console.log(doc.id, " => ", doc.data());
                                 let data = doc.data();
                                 let feed = new Feed(data.title,data.text);
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

  addUserFeed: function(uid,fid,title,text){
    const users = firestore.collection("Users");
    let feed = new Feed(title,text);
    users.doc(uid).collection("Feed").doc(fid).set(feed.toFirestore());
  },

  getUserFeed: function(uid,fid){
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
                  feed = new Feed(data.title,data.text);
                  return feed;
                })
              .catch(function (error) {
                console.log("Error getting documents: ", error);
              });
  },

  getUserFeeds: function(uid){
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

  deleteUserFeed:function(uid,fid){
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

 //-------------------------Notifications-----------------------------------------------------------------------



   addUserNotification: function(uid,nid,title,text){
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
     let notification = new Notification(title,text,timestamp);
     users.doc(uid).collection("Notifications").doc(nid).set(notification.toFirestore());
   },

   getUserNotifications: function(uid){
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

   getUserNotification: function(uid,nid){
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
                     notification = new Notification(data.title,data.text,data.notification);
                     return notification;
                   })
                 .catch(function (error) {
                   console.log("Error getting documents: ", error);
                 });
   },


   deleteUserNotification:function(uid,nid){
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

    addLostPetNotify: function(lid,name,photo,size,color,breed,notes,place,uid,email,phone){
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
         let notification = new LostPetNotify(name,photo,size,color,breed,notes,place,timestamp,uid,email,phone);
         lostPets.doc(lid).set(notification.toFirestore());
       },

    getLostPetNotifications: function(){
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

       getLostPetNotification: function(lid){
             const lostPets = firestore.collection("LostPetNotify");
                   var notification;
                   return lostPets
                     .doc(lid)
                     .get()
                     .then(function (doc) {
                         // doc.data() is never undefined for query doc snapshots
                         console.log(doc.id, " => ", doc.data());
                         let data = doc.data();
                         notification = new LostPetNotify(data.name,data.photo,data.size,data.color,data.breed,data.notes,data.place,data.timestamp,data.uid,data.email,data.phone);
                         return notification;
                       })
                     .catch(function (error) {
                       console.log("Error getting documents: ", error);
                     });
       },


       deleteLostPetNotification:function(lid){
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

    addLostPetSeen: function(lid,photo,size,color,breed,notes,place,uid,email,phone){
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
         let notification = new LostPetSeen(photo,size,color,breed,notes,place,timestamp,uid,email,phone);
         lostPets.doc(lid).set(notification.toFirestore());
       },

    getLostPetsSeen: function(){
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

       getLostPetSeen: function(lid){
             const lostPets = firestore.collection("LostPetSeen");
                   var notification;
                   return lostPets
                     .doc(lid)
                     .get()
                     .then(function (doc) {
                         // doc.data() is never undefined for query doc snapshots
                         console.log(doc.id, " => ", doc.data());
                         let data = doc.data();
                         notification = new LostPetSeen(data.size,data.color,data.breed,data.notes,data.place,data.timestamp,data.uid,data.email,data.phone);
                         return notification;
                       })
                     .catch(function (error) {
                       console.log("Error getting documents: ", error);
                     });
       },


       deleteLostPetSeen:function(lid){
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
