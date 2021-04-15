import { firestore } from "../../firebaseconfig.js";
import UserAnimal from "../Objects/UserAnimal.js";

const dbUserAnimal = {
  addUserAnimal: function (uid, name, age, breed, size, color, photo, type) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    let animal = new UserAnimal(name, age, breed, size, color, photo, type);
    //console.log(type);
    //console.log(animal);
    return animals.add(animal.toFirestore());
  },
  /* how to call get from outside
  db.UserAnimals('axr4183').then(function(animals){
             console.log(animals);
          });
*/
  addAnimalDisease: function (uid, aid, disease) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    animals.doc(aid).collection("Diseases").add({ name: disease });
  },
  /*
  addAnimalStat: function (uid, aid) {
    const users = firestore.collection("Users");
    const stats = users
      .doc(uid)
      .collection("Animals")
      .doc(aid)
      .collection("Stats");
    stats.add({ name: stat });
  },

  */

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
        //label: utils.timestamp(),
        value: value,
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
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
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
        //console.log(doc.id, " => ", doc.data());
        let data = doc.data();
        //console.log(data);
        animal = new UserAnimal(
          data.name,
          data.age,
          data.breed,
          data.size,
          data.color,
          data.photo,
          data.type
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
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          samples.push(doc.id);
          //console.log(user);
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
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        sample = doc.data();
        //console.log(user);
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
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
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
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, " => ", doc.data());
        disease = doc.data();
        //console.log(user);
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

  deleteAnimalDiseaseByName: function (uid, aid, name) {
    dbUserAnimal.getAnimalDiseaseByName(uid, aid, name).then((ids) => {
      var id = ids[0];
      const animals = firestore
        .collection("Users")
        .doc(uid)
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
    });
  },
  /*
  deleteAnimalStat: function (uid, aid, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    animals
      .doc(aid)
      .collection("Stats")
      .doc(id)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  */

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
        console.log("Document successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  },

  deleteAnimal: function (uid, aid) {
    const users = firestore.collection("Users");
    this.getAnimalDiseases(uid, aid).then(function (diseases) {
      if (diseases.length != 0) {
        // diseases are optional so must be checked
        diseases.forEach((id) =>
          dbUserAnimal.deleteAnimalDisease(uid, aid, id)
        );
      }

      dbUserAnimal.getAnimalStats(uid, aid).then(function (stats) {
        if (stats.length != 0) {
          stats.forEach(function (id) {
            dbUserAnimal
              .getAnimalStatSamples(uid, aid, id)
              .then(function (samples) {
                if (samples.length != 0) {
                  samples.forEach((sampleid) =>
                    dbUserAnimal.deleteAnimalStatSample(uid, aid, id, sampleid)
                  );
                }
              });
            dbUserAnimal.deleteAnimalStat(uid, aid, id);
          });
        }
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
