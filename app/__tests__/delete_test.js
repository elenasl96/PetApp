import dbPlace from "../firebase/Database/Functions/dbPlace";
import dbNews from "../firebase/Database/Functions/dbNews";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import dbUser from "../firebase/Database/Functions/dbUser";
import User from "../firebase/Database/Objects/User";

beforeAll(() => {
    
    //run this the first time to refresh db 
    // seems not to delete adoptable animals and diseases, value of samples in useranimal and saved places of user 
    /*
    dbLostPet.deleteLostPetNotificationByUid('user1'); //OK
    dbLostPet.deleteLostPetSeenByUid('user2'); //OK  */
    
    //dbUser.deleteUser('G2lmt9yiq6NgUkRnk73CJwRdABE3');
    //dbUserAnimal.deleteAnimal('user1','mcRitDAc1luOiVvbAgc4');

    dbPlace.addPlace('place1',
    'Kennel',
    'description of a kennel',
    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
    'viale romagna 2',
    41.0,
    41.3,
    "latitudeDelta",
    "longitudeDelta").then((place) => {

        dbUser.addUser('user2',
        'test',
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
        'business',
        'via calici 10').then((user2) =>{
        });   
    // add news to kennel
    dbNews.addNews(place.id,"My first news", "text");
    dbNews.addNews(place.id,"My second news", "text");

    //add animals to kennel
    dbAdoptableAnimal.addAdoptableAnimal(
        place.id,
        "Bobby",
        10,
        "Labrador",
        "Medium",
        "Black",
        'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
        "Dog",
        "Kind dog"
      ).then((pet) =>{
        dbAdoptableAnimal.addAdoptableAnimalDisease(place.id,pet.id,"Disease1");
        dbAdoptableAnimal.addAdoptableAnimalDisease(place.id,pet.id,"Disease2");
      });
    });
})

test('db user2 test', () => {
    return expect(dbUser.getUser('user2')).resolves.toBeInstanceOf(User);
});

