import utils from "../../../shared/Utilities.js";
import { firestore } from "../../FirebaseConfig.js";
import UserAnimal from "../objects/UserAnimal.js";

const dbUserAnimal = {
  addUserAnimal: function (uid, name, age, breed, size, color, photo, type) {
    const users = firestore.collection("Users");
    const animals = users.doc(uid).collection("Animals");
    let yearOfBirth = utils.getYearOfBirth(age);
    let animal = new UserAnimal(
      name,
      yearOfBirth,
      breed,
      size,
      color,
      photo,
      type
    );
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
    animals.doc(aid).collection("Stats").doc(stat).set({
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
          samples.push(doc.id);
          return samples;
        });
        return samples;
      })
      .catch(function (error) {
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
      })
      .catch(function (error) {
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
        })
        .catch(function (error) {
        });
    });
  },

  deleteAnimalStat: function (uid, aid, id) {
    return dbUserAnimal.getAnimalStatSamples(uid, aid, id).then((samples) => {
      if (samples.length != 0) {
        var promisesSamples = samples.forEach((sampleid) => {
          return dbUserAnimal.deleteAnimalStatSample(uid, aid, id, sampleid);
        });
      }
      return Promise.all([promisesSamples]).then(() => {
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
          })
          .catch(function (error) {
          });
      });
    });
  },

  deleteAnimalStatSample: function (uid, aid, stat, id) {
    const animals = firestore
      .collection("Users")
      .doc(uid)
      .collection("Animals");
    const stats = animals.doc(aid).collection("Stats");
    return stats
      .doc(stat)
      .collection("Samples")
      .doc(id)
      .delete()
      .then(function () {
      })
      .catch(function (error) {
      });
  },

  deleteAnimal: function (uid, aid) {
    const users = firestore.collection("Users");
    return dbUserAnimal.getAnimalDiseases(uid, aid).then(function (diseases) {
      if (diseases.length != 0) {
        // diseases are optional so must be checked
        var promisesDiseases = diseases.forEach((id) => {
          return dbUserAnimal.deleteAnimalDisease(uid, aid, id);
        });
      }

      return dbUserAnimal.getAnimalStats(uid, aid).then((stats) => {
        if (stats.length != 0) {
          var promisesStats = stats.forEach((id) => {
            return dbUserAnimal.deleteAnimalStat(uid, aid, id);
          });
        }

        return Promise.all([promisesDiseases, promisesStats]).then(() => {
          return users
            .doc(uid)
            .collection("Animals")
            .doc(aid)
            .delete()
            .then(function () {
            })
            .catch(function (error) {
            });
        });
      });
    });
  },

  // get disease descriptions
  getDiseaseDescription(name, type) {
    var ref = firestore.collection("DiseaseDescriptions");
    var descriptions = [];
    return ref
      .where("name", "==", name)
      .where("type", "==", type)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          descriptions.push(doc.data().description);
          return descriptions;
        });
        return descriptions;
      })
      .catch(function (error) {
      });
  },

  addDiseaseDescription(name, description, type) {
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
