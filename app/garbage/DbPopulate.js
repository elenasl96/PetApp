import dbLostPet from "../firebase/database/functions/DbLostPet";
import dbPlace from "../firebase/database/functions/DbPlace";
import dbUserAnimal from "../firebase/database/functions/DbUserAnimal";

export const dbPopulate = {
  addPetToUser: function (uid, animal) {
    dbUserAnimal.addUserAnimal(
      uid,
      animal.getName(),
      animal.getAge(),
      animal.getBreed(),
      animal.getSize(),
      animal.getColor(),
      animal.getPhoto(),
      animal.getType()
    );
  },

  addPlaceToUser: function (uid, place) {
    dbPlace
      .addPlace(
        place.getName(),
        place.getType(),
        place.getDescription(),
        place.getPhoto(),
        place.getAddress(),
        place.getLat(),
        place.getLng()
      )
      .then((doc) => {
        dbPlace.addUserPlace(uid, doc.id);
      });
  },
  addLostPet: function (uid, lostPet) {
    dbLostPet.addLostPetNotify(
      lostPet.getName(),
      lostPet.getPhoto(),
      lostPet.getSize(),
      lostPet.getColor(),
      lostPet.getBreed(),
      lostPet.getNotes(),
      lostPet.getPlace(),
      uid,
      lostPet.getEmail(),
      lostPet.getPhone(),
      lostPet.getLat(),
      lostPet.getLng()
    );
  },
  addLostPetSeen: function (uid, lostPet) {
    dbLostPet.addLostPetSeen(
      lostPet.getPhoto(),
      lostPet.getSize(),
      lostPet.getColor(),
      lostPet.getBreed(),
      lostPet.getNotes(),
      lostPet.getPlace(),
      uid,
      lostPet.getEmail(),
      lostPet.getPhone(),
      lostPet.getLat(),
      lostPet.getLng()
    );
  },
};
