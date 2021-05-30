import dbLostPet from "./dbLostPet";
import dbPlace from "./dbPlace";
import dbUserAnimal from "./dbUserAnimal";

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
        place.getLng(),
        "",
        ""
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
      lostPet.getPhone()
    );
  },
};
