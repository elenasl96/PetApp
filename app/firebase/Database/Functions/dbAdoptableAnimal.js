import { firestore } from "../../FirebaseConfig.js";
import AdoptableAnimal from "../objects/AdoptableAnimal.js";

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
    return places.doc(pid).collection("Animals").add(animal.toFirestore());
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
        return animal;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAdoptableAnimalDiseaseByName: function (pid, aid, name) {
    const animals = firestore
      .collection("Places")
      .doc(pid)
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

  getAdoptableAnimals: function (pid) {
    const places = firestore.collection("Places");
    var animals = [];
    return places
      .doc(pid)
      .collection("Animals")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          let data = doc.data();
          animals.push(doc.id);
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
    return animals.doc(aid).collection("Diseases").add({ name: disease });
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
          diseases.push(doc.id);
          return diseases;
        });
        return diseases;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  getAdoptableAnimalDisease: function (pid, aid, id) {
    const animals = firestore
      .collection("Places")
      .doc(pid)
      .collection("Animals");
    var disease;
    return animals
      .doc(aid)
      .collection("Diseases")
      .doc(id)
      .get()
      .then(function (doc) {
        disease = doc.data();
        return disease;
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
    return animals
      .doc(aid)
      .collection("Diseases")
      .doc(id)
      .delete()
      .then(function () {
        //console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAdoptableAnimal: function (pid, aid) {
    const places = firestore.collection("Places");
    return dbAdoptableAnimal.getAdoptableAnimalDiseases(pid, aid).then(function (diseases) {
      if (diseases.length != 0) {
        // diseases are optional so must be checked
        var promisesDiseases = diseases.forEach((id) => {
          return dbAdoptableAnimal.deleteAdoptableAnimalDisease(pid, aid, id);
        });
      }

       return Promise.all([promisesDiseases]).then(() => {
                    return places
                      .doc(pid)
                      .collection("Animals")
                      .doc(aid)
                      .delete()
                      .then(function () {
                        //console.log("Document successfully deleted!");
                      })
                      .catch(function (error) {
                        console.error("Error removing document: ", error);
                      });
        });  
    
    });
  },

  getAdoptableAnimalDiseaseByName: function (pid, aid, name) {
    const animals = firestore
      .collection("Places")
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

  deleteAnimalDiseaseByName: function (pid, aid, name) {
    dbAdoptableAnimal
      .getAdoptableAnimalDiseaseByName(pid, aid, name)
      .then((ids) => {
        var id = ids[0];
        const animals = firestore
          .collection("Places")
          .doc(pid)
          .collection("Animals");
        return animals
          .doc(aid)
          .collection("Diseases")
          .doc(id)
          .delete()
          .then(function () {
            //console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      });
  },

  addDiseaseDescription(name,description,type){
    const ref = firestore.collection("DiseaseDescriptions");
    let disease = {
       name: name,
       description: description,
       type: type,
    };
    ref.add(disease);
  },

  // get disease descriptions
  getDiseaseDescription(name,type) {
    var ref = firestore.collection("DiseaseDescriptions");
    var descriptions = [];
    return ref
      .where("name", "==", name)
      .where("type","==", type)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          descriptions.push(doc.data().description);
          return descriptions;
        });
        return descriptions;
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  },

  deleteAdoptableAnimalDiseaseByName: function (pid, aid, name) {
    dbAdoptableAnimal
      .getAdoptableAnimalDiseaseByName(pid, aid, name)
      .then((ids) => {
        var id = ids[0];
        const animals = firestore
          .collection("Places")
          .doc(uid)
          .collection("Animals");
        return animals
          .doc(aid)
          .collection("Diseases")
          .doc(id)
          .delete()
          .then(function () {
            //console.log("Document successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing document: ", error);
          });
      });
  },

  updateAdoptablePetPhoto: function (pid, aid, url) {
    firestore
      .collection("Places")
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .update({ photo: url });
  },
};
export default dbAdoptableAnimal;
