import {firestore} from "../../firebaseconfig.js";
import AdoptableAnimal from "../Objects/AdoptableAnimal.js";

const dbAdoptableAnimal = {
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
             dbAdoptableAnimal.deleteAdoptableAnimalDisease(pid, aid, id);
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
export default dbAdoptableAnimal;