import constants from "../../shared/constants";
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
    "",
    "Via farini 2, Milano",
    "45.482860279390565",
    "9.18166729801941",
    "",
    ""
  ),
};
