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
};
