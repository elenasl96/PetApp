import dbUser from "../../firebase/database/functions/DbUser";
import dbUserAnimal from "../../firebase/database/functions/DbUserAnimal";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";
import dbFeed from "../../firebase/database/functions/DbFeed";
import dbLostPet from "../../firebase/database/functions/DbLostPet";
import dbNews from "../../firebase/database/functions/DbNews";
import dbNotification from "../../firebase/database/functions/DbNotification";
import dbPlace from "../../firebase/database/functions/DbPlace";
import { dbPopulate } from "../../garbage/DbPopulate";
import UserAnimal from "../../firebase/database/objects/UserAnimal";
import Feed from "../../firebase/database/objects/Feed";
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
  //var animals = [ new UserAnimal("test","2017","None","Medium","Black","photo","Dog"),
  //new UserAnimal("test","2011","None","Small","Black","photo","Dog"),
 // new UserAnimal("test","2011","Collie","Small","Black","photo","Dog")
  //return expect(dbFeed.getFeeds(animals,"gbfBtH1XbDMYice2pM0zV7caEjn2","17/06/2021",0)).resolves.toHaveLength(5);
  //return expect(dbFeed.filterAnimals(animals)).toHaveLength(2);
  //dbFeed.getBreedFeed(uid,type,id)
  //return expect(dbFeed.getBreedFeed("gbfBtH1XbDMYice2pM0zV7caEjn2","Dog",1)).resolves.toBeInstanceOf(Feed);
  //return expect(dbFeed.getFeedsByFilter("Cat","Age","Young",1)).resolves.toHaveLength(2);
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
