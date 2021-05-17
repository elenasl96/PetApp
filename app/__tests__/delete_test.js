import dbUser from "../firebase/Database/Functions/dbUser";
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import dbFeed from "../firebase/Database/Functions/dbFeed";
import dbLostPet from "../firebase/Database/Functions/dbLostPet";
import dbNews from "../firebase/Database/Functions/dbNews";
import dbNotification from "../firebase/Database/Functions/dbNotification";
import dbPlace from "../firebase/Database/Functions/dbPlace";

beforeAll(() => {
    
    dbUser.deleteUser('user1'); 
    //dbUserAnimal.deleteAnimal('user1','DR5BCzY9sMxwxjcco7oH');
    //dbLostPet.deleteLostPetNotificationByUid('user1'); //OK
    //dbLostPet.deleteLostPetSeenByUid('user2'); //OK 
    // to fix : delete user, delete adopt animal , delete place
})

test('db user2 test', () => {
     expect(1).toBe(1);
});


afterAll(() => {

})
