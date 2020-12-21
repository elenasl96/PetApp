import React from 'react';
import {firestore} from './firebaseconfig.js';
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
   }


}

export default db ;








