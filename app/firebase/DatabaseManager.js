import React from 'react';
import {firestore,storage} from './firebaseconfig.js';
import User from './User.js';

const db = {

   addUser : function(name,password,photo){
                           const users = firestore.collection('Users');
                           let user = new User(name,password,photo);
                           users.add(user.toFirestore());
   },

   getUser : function(name){
                           const users = firestore.collection('Users');
                           users.where("name", "==", name).get().then(function(querySnapshot) {
                                                                               querySnapshot.forEach(function(doc) {
                                                                                   let data = doc.data();
                                                                                   let user = new User(data.name,data.password,data.photo);
                                                                                   return user;
                                                                                   //console.log(user);
                                                                               });
                                                                               });
   },

   toStorage : function(file){

      console.log("toStorage");
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










