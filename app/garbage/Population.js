import constants from "../shared/Constants";
import LostPetNotify from "../firebase/database/objects/LostPetNotify";
import Place from "../firebase/database/objects/Place";
import UserAnimal from "../firebase/database/objects/UserAnimal";

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
  puzzola: new UserAnimal(
    "Puzzola",
    11,
    "None",
    constants.SIZES_PETS[0],
    "Orange",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2Fcat.jpg?alt=media&token=f10130b3-6f63-4577-8c0e-c5372a1b588d",
    constants.TYPES_PETS[1]
  ),
  willy: new UserAnimal(
    "Willy",
    1,
    "Siamese",
    constants.SIZES_PETS[0],
    "White",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2Fsiamese.jpg?alt=media&token=733d79ca-fb8a-4b86-9b13-5ff86d54c4ce",
    constants.TYPES_PETS[1]
  ),
  sweet: new UserAnimal(
    "Sweet",
    10,
    "Collie",
    constants.SIZES_PETS[1],
    "Particolor",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2Fcollie.jpg?alt=media&token=c9150983-d6b5-417f-982a-639e6f2e93b5",
    constants.TYPES_PETS[0]
  ),
  tippi: new UserAnimal(
    "Tippi",
    5,
    "None",
    constants.SIZES_PETS[1],
    "Particolor",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2Fdog.jpeg?alt=media&token=27988d67-b24a-4857-9782-580b9e2fb469",
    constants.TYPES_PETS[0]
  ),
};

export const place = {
  labVeterinary: new Place(
    "Veterinary Lab",
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
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2Fvet3.jpg?alt=media&token=1b5b5720-1f44-4dc2-97c0-ef38ec83e1a1",
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
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2Fpark1.jpg?alt=media&token=5d1ecf7a-22b1-42d1-b9b8-bbdff6554b08",
    "Parco Wanda Osiris, Milano",
    45.50212797942806,
    9.19550437629243
  ),
  dogPark: new Place(
    "Dog Park",
    constants.TYPES_PLACES[1],
    "A giant park with every type of funny toy for your dog in an exclusive area of Milan.",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/places%2Fpark2.jpg?alt=media&token=cfdcbed1-46e8-4934-bed2-bc02ecb5bfd5",
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

export const lostPetSeen = {
  briciola: new LostPetNotify(
    "Briciola",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2FGioia.jpg?alt=media&token=026166cf-02d4-4d2c-b591-3269b2a012a0",
    constants.SIZES_PETS[0],
    constants.COLORS_PETS[0],
    constants.BREEDS_DOG[0],
    "Dog with a tumor",
    "Via Mac mahon 20",
    "21/06/01 10:00",
    uids.elena,
    "test@prova.it",
    "329/123456",
    45.4919266118872,
    9.160404472186242
  ),
  cipolla: new LostPetNotify(
    "Cipolla",
    "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/pets%2FCipolla.jpg?alt=media&token=5b3255ce-9767-490e-af06-ed917b4a8c86",
    constants.SIZES_PETS[0],
    constants.COLORS_PETS[1],
    constants.BREEDS_CAT[0],
    "Not very sociable dog",
    "Zona Zara, Milano",
    "20/05/01 11:00",
    uids.elena,
    "test@prova.it",
    "329/123456",
    45.49231004300794,
    9.194100390792652
  ),
};
