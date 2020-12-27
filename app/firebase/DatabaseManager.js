import {useState,useEffect} from 'react';
import {firestore,storage} from './firebaseconfig.js';
import User from './User.js';

const db = {


   addUser : function(uid,name,photo,type,address){
                           const users = firestore.collection('Users');
                           let user = new User(name,photo,type,address);
                           users.doc(uid).set(user.toFirestore());
   },

   getUser : function(uid){
                              const users = firestore.collection('Users');
                              var user;
                              return users
                                 .doc(uid)
                                 .get()
                                 .then(function(doc){
                                   let data = doc.data();
                                   user = new User(data.name,data.photo,data.type,data.address);
                                   console.log(user);
                                   return user;
                              });
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
   toStorage : function(file){

      //Reference to firebase storage
      storageRef = storage.ref();

      // Create the file metadata
      var metadata = {
        contentType: 'image/jpeg'
      };

      //Create a filename
      let date = new Date().getTime();
      let user = "Matteo";
      let filename = user + date;

      // Upload file and metadata
      var uploadTask = storageRef.child('images/' + filename).put(file, metadata);
      return filename; //filename must be saved for future accesses;
   },

   fromStorage : function(filename){
      storageRef = storage.ref();
      var imageRef = storageRef.child('images/' + filename);
      imageRef.getDownloadURL().then(function(url) {

        // This can be downloaded directly:
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        console.log(url);
        return url;
      }).catch(function(error) {
         console.log('error');
      });
   }
}

export default db ;










