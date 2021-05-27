import { firestore } from "../../firebaseconfig.js";
import UserAnimal from "../Objects/UserAnimal.js";

const dbUserAnimal = {
  addUserAnimal: function (uid, name, age, breed, size, color, photo, type) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    let animal = new UserAnimal(name, age, breed, size, color, photo, type);
    return animals.add(animal.toFirestore());
  },

  addAnimalDisease: function (uid, aid, disease) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    animals.doc(aid).collection("Diseases").add({ name: disease });
  },

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
        value: value,
      });
  },

  addAnimalStat: function (uid, aid, stat) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    animals
      .doc(aid)
      .collection("Stats")
      .doc(stat)
      .set({
        name: stat,
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
          animals.push(doc.id);
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
        let data = doc.data();
        animal = new UserAnimal(
          data.name,
          data.age,
          data.breed,
          data.size,
          data.color,
          data.photo,
          data.type
        );
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
          stats.push(doc.id);
          return stats;
        });
        return stats;
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
          samples.push(doc.id);
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
        sample = doc.data();
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
          diseases.push(doc.id);
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
        disease = doc.data();
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

  deleteAnimalDiseaseByName: function (uid, aid, name) {
    dbUserAnimal.getAnimalDiseaseByName(uid, aid, name).then((ids) => {
      var id = ids[0];
      const animals = firestore
        .collection("Users")
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
  
  deleteAnimalStat: function (uid, aid, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    return animals
      .doc(aid)
      .collection("Stats")
      .doc(id)
      .delete()
      .then(function () {
        //console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  

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
        //console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },



  deleteAnimal: function (uid, aid) {
    const users = firestore.collection("Users");
    dbUserAnimal.getAnimalDiseases(uid, aid).then(function (diseases) {
      if (diseases.length != 0) {
        // diseases are optional so must be checked
        var promisesDiseases = diseases.forEach((id) => {
          return dbUserAnimal.deleteAnimalDisease(uid, aid, id);
        });
      }

      dbUserAnimal.getAnimalStats(uid,aid).then((stats) => {
        if (stats.length != 0) {
          var promisesStats = stats.forEach((id) => {
            dbUserAnimal.getAnimalStatSamples(uid, aid, id).then((samples) => {
               if (samples.length != 0) {
                  var index = 1;
                  samples.forEach((sampleid) => {
                    dbUserAnimal.deleteAnimalStatSample(uid, aid, id, sampleid);
                    if(index == samples.length){
                      return dbUserAnimal.deleteAnimalStat(uid, aid, id);
                    }
                    else{index = index + 1;}
                  });
            }
            else{
              return dbUserAnimal.deleteAnimalStat(uid, aid, id);
            }
              });
          });
        }

        

       return Promise.all([promisesDiseases,promisesStats]).then(() => {
                    return users
                      .doc(uid)
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
    });
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

  addDiseaseDescription(name,description,type){
    
    const ref = firestore.collection("DiseaseDescriptions");
    let disease = {
       name: name,
       description: description,
       type: type,
    };
    ref.add(disease);
  },

  updatePetPhoto: function (uid, aid, url) {
    firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .update({ photo: url });
  },
};

export default dbUserAnimal;
