import constants from "../../shared/constants";
import LostPetNotify from "./Objects/LostPetNotify";
import Place from "./Objects/Place";
import UserAnimal from "./Objects/UserAnimal";

export const uids = {
  elena: "zXe1We0SrOaaw8YliDx7OpdB4E23",
  matteo: "gbfBtH1XbDMYice2pM0zV7caEjn2",
};

export const pet = {
  gioia: new UserAnimal(
    "Gioia",
    8,
    constants.BREEDS_DOG[0],
    constants.SIZES_PETS[0],
    constants.COLORS_PETS[0],
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2FGioia.jpg?alt=media&token=026166cf-02d4-4d2c-b591-3269b2a012a0",
    constants.TYPES_PETS[0]
  ),
  cipolla: new UserAnimal(
    "Cipolla",
    3,
    constants.BREEDS_CAT[0],
    constants.SIZES_PETS[0],
    constants.COLORS_PETS[1],
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2FCipolla.jpg?alt=media&token=5b3255ce-9767-490e-af06-ed917b4a8c86",
    constants.TYPES_PETS[1]
  ),
};

export const place = {
  labVeterinary: new Place(
    "LabVeterinary",
    constants.TYPES_PLACES[0],
    "We take care of your best friend. Our team is the more professional in the city.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2FgbfBtH1XbDMYice2pM0zV7caEjn21619081104651?alt=media&token=58c5bd7f-0312-4ff0-9880-289c690d8f7c",
    "Via farini 2, Milano",
    45.482860279390565,
    9.18166729801941
  ),
  confortHouse: new Place(
    "Confort House",
    constants.TYPES_PLACES[2],
    "Find a place in which your friend can meet new friends.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2Fkennel.jpg?alt=media&token=c2ada513-2e3b-4e10-9a75-6a47b303592c",
    "Piazza Maciachini 1, Milano",
    45.49742784437551,
    9.18689115569105
  ),
  vetty: new Place(
    "Vetty",
    constants.TYPES_PLACES[0],
    "Contact us for every emergency. 24H/24H emergency veterinary.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2FgbfBtH1XbDMYice2pM0zV7caEjn21619081104651?alt=media&token=58c5bd7f-0312-4ff0-9880-289c690d8f7c",
    "Via Giuseppe Ferrari 10, Milano",
    45.48542562941739,
    9.184332484948477
  ),
  petClinic: new Place(
    "Pet Clinic",
    constants.TYPES_PLACES[0],
    "The biggest clinic here in Milan. We treat all types of animal disease. You can trust us and our professionals vets.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2FgbfBtH1XbDMYice2pM0zV7caEjn21619081104651?alt=media&token=58c5bd7f-0312-4ff0-9880-289c690d8f7c",
    "Via Fatebenefratelli 10, Milano",
    45.473117208620046,
    9.189788384948173
  ),
  happyPark: new Place(
    "Happy Park",
    constants.TYPES_PLACES[1],
    "A Park for every human friend.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2FgbfBtH1XbDMYice2pM0zV7caEjn21619081104651?alt=media&token=58c5bd7f-0312-4ff0-9880-289c690d8f7c",
    "Parco Wanda Osiris, Milano",
    45.50212797942806,
    9.19550437629243
  ),
  dogPark: new Place(
    "Dog Park",
    constants.TYPES_PLACES[1],
    "A giant park with every type of funny toy for your dog in an exclusive area of Milan.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2FgbfBtH1XbDMYice2pM0zV7caEjn21619081104651?alt=media&token=58c5bd7f-0312-4ff0-9880-289c690d8f7c",
    "Parco biblioteca degli alberi, Milano",
    45.48464145426812,
    9.192929278204524
  ),
};

export const lostPet = {
  gioia: new LostPetNotify(
    "Gioia",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2FGioia.jpg?alt=media&token=026166cf-02d4-4d2c-b591-3269b2a012a0",
    constants.SIZES_PETS[0],
    constants.COLORS_PETS[0],
    constants.BREEDS_DOG[0],
    "Not very sociable dog",
    "Zona Zara, Milano",
    "20/05/01 10:00",
    uids.elena,
    "test@prova.it",
    "329/123456",
    45.473117208620046,
    9.189788384948173
  ),
  cipolla: new LostPetNotify(
    "Cipolla",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2FCipolla.jpg?alt=media&token=5b3255ce-9767-490e-af06-ed917b4a8c86",
    constants.SIZES_PETS[0],
    constants.COLORS_PETS[1],
    constants.BREEDS_CAT[0],
    "Not very sociable dog",
    "Zona Istria, Milano",
    "20/05/01 11:00",
    uids.elena,
    "test@prova.it",
    "329/123456",
    45.48542562941739,
    9.184332484948477
  ),
};
