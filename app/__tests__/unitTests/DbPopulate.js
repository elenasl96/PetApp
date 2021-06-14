import dbUser from "../../firebase/database/functions/DbUser";
import dbUserAnimal from "../../firebase/database/functions/DbUserAnimal";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";
import dbFeed from "../../firebase/database/functions/DbFeed";
import dbLostPet from "../../firebase/database/functions/DbLostPet";
import dbNews from "../../firebase/database/functions/DbNews";
import dbNotification from "../../firebase/database/functions/DbNotification";
import dbPlace from "../../firebase/database/functions/DbPlace";
import { dbPopulate } from "../../garbage/DbPopulate";
import {
  pet,
  uids,
  place,
  lostPet,
  lostPetSeen,
} from "../../garbage/Population";
import constants from "../../shared/Constants";

beforeAll(() => {
  /*  
  constants.BREEDS_DOG.map((breed) => {
    let title = "Feed for " + breed;
    dbFeed.addPetFeed("Dog", "Breed", 1, breed, title, "Text");
  });

  constants.BREEDS_CAT.map((breed) => {
    let title = "Feed for " + breed;
    dbFeed.addPetFeed("Cat", "Breed", 1, breed, title, "Text");
  });

  
  constants.DISEASES_DOG.map((disease) =>{
    let description = "Description for " + disease;
    dbUserAnimal.addDiseaseDescription(disease,description,"Dog");
  });

  constants.DISEASES_CAT.map((disease) =>{
    let description = "Description for " + disease;
    dbUserAnimal.addDiseaseDescription(disease,description,"Cat");
  }); */
});

afterAll(() => {});

test("pet population", () => {
  //dbPopulate.addPetToUser(uids.elena, pet.cipolla);
  //dbPopulate.addPetToUser(uids.elena, pet.gioia);
  return expect(true).toBeTruthy();
  //return expect(dbFeed.get("Dog","Breed","Shiba",0)).resolves.toHaveLength(1);
});

test("place population", () => {
  //dbPopulate.addPlaceToUser(uids.elena, place.labVeterinary);
  //dbPopulate.addPlaceToUser(uids.elena, place.confortHouse);
  //dbPopulate.addPlaceToUser(uids.matteo, place.confortHouse);
  //dbPopulate.addPlaceToUser(uids.matteo, place.petClinic);
  //dbPopulate.addPlaceToUser(uids.matteo, place.happyPark);
  //dbPopulate.addPlaceToUser(uids.matteo, place.dogPark);
  return expect(true).toBeTruthy();
});

test("lost pets population", () => {
  //dbPopulate.addLostPet(uids.elena, lostPet.gioia);
  //dbPopulate.addLostPet(uids.elena, lostPet.cipolla);
  return expect(true).toBeTruthy();
});

test("lost pets seen population", () => {
  //dbPopulate.addLostPetSeen(uids.matteo, lostPetSeen.briciola);
  //dbPopulate.addLostPetSeen(uids.elena, lostPetSeen.cipolla);
  return expect(true).toBeTruthy();
});
