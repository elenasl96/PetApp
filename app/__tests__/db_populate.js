import dbUser from "../firebase/Database/Functions/dbUser";
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import dbFeed from "../firebase/Database/Functions/dbFeed";
import dbLostPet from "../firebase/Database/Functions/dbLostPet";
import dbNews from "../firebase/Database/Functions/dbNews";
import dbNotification from "../firebase/Database/Functions/dbNotification";
import dbPlace from "../firebase/Database/Functions/dbPlace";
import { dbPopulate } from "../firebase/Database/Functions/dbPopulate";
import { pet, uids, place } from "../firebase/Database/Population";
import constants from "../shared/constants";

beforeAll(() => {

  constants.BREEDS_DOG.map((breed) =>{
     let title = "Feed for " + breed;
     dbFeed.addPetFeed("Dog","Breed",0,breed,title,"Text");
  });

  constants.BREEDS_CAT.map((breed) =>{
    let title = "Feed for " + breed;
    dbFeed.addPetFeed("Cat","Breed",0,breed,title,"Text");
  });

  /*

  constants.DISEASES_DOG.map((disease) =>{
    let description = "Description for " + disease;
    dbUserAnimal.addDiseaseDescription(disease,description,"Dog");
  });

  constants.DISEASES_CAT.map((disease) =>{
    let description = "Description for " + disease;
    dbUserAnimal.addDiseaseDescription(disease,description,"Cat");
  });*/


});

afterAll(() => {});

test("pet population", () => {
  //dbPopulate.addPetToUser(uids.elena, pet.cipolla);
  //dbPopulate.addPetToUser(uids.elena, pet.gioia);
  return expect(true).toBeTruthy();
});

test("place population", () => {
  //dbPopulate.addPlaceToUser(uids.elena, place.labVeterinary);
  return expect(true).toBeTruthy();
});
