import dbUser from "../firebase/Database/Functions/dbUser";
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import dbAdoptableAnimal from "../firebase/Database/Functions/dbAdoptableAnimal";
import dbFeed from "../firebase/Database/Functions/dbFeed";
import dbLostPet from "../firebase/Database/Functions/dbLostPet";
import dbNews from "../firebase/Database/Functions/dbNews";
import dbNotification from "../firebase/Database/Functions/dbNotification";
import dbPlace from "../firebase/Database/Functions/dbPlace";
import User from "../firebase/Database/Objects/User";

beforeAll(() => {

    dbPlace.addPlace('place1',
    'Kennel',
    'description of a kennel',
    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
    'viale romagna 2',
    41.0,
    41.3,
    "latitudeDelta",
    "longitudeDelta").then((place) => {

    //creates standard user , he saves the place and adds feeds
    dbUser.addUser('user1',
                   'test',
                   'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
                   'user',
                   'via calici 10').then((user1) => {
                     dbPlace.addSavedPlace('user1',place.id);
                     dbFeed.addRandomFeeds([],'user1','15/05/2021',0);
                     dbNotification.addUserNotification('user1','Welcome to GPaw','Hi!');
                     dbUserAnimal.addUserAnimal('user1',
                                                'test',
                                                10,
                                                'Labrador',
                                                'Medium',
                                                'Black',
                                                'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
                                                'Dog').then((doc) => {
                                                    dbUserAnimal.addAnimalStat('user1',doc.id,'weight');
                                                    dbUserAnimal.addAnimalStat('user1',doc.id,'height');
                                                    dbUserAnimal.addAnimalStatSample('user1',doc.id,'weight',30);
                                                    dbUserAnimal.addAnimalStatSample('user1',doc.id,'height',30);
                                                    dbUserAnimal.addAnimalDisease('user1',doc.id,'Disease1');

                                                });
                   });
    

    //create business user , he adds a place and adds feeds 
    dbUser.addUser('user2',
                   'test',
                   'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
                   'business',
                   'via calici 10').then((user2) =>{
                     dbPlace.addUserPlace('user2',place.id);
                     dbFeed.addRandomFeeds([],'user2','14/05/2021',0);
                     dbNotification.addUserNotification('user2','Welcome to GPaw','Hi!');
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
       
     dbLostPet.addLostPetNotify(
                    'Willy',
                    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
                    'Big',
                    'White',
                    'Golden Retriever',
                    '',
                    'Moscova',
                    'user1',
                    'user1@gmail.com',
                    'phone');
    
    dbLostPet.addLostPetSeen('https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
    'Big',
    'White',
    'Golden Retriever',
    '',
    'Moscova',
    'user2',
    'user2@gmail.com',
    'phone');
       
})


test('db user1 test', () => {
    return expect(dbUser.getUser('user1')).resolves.toBeInstanceOf(User);
}); 

test('db user2 test', () => {
    return expect(dbUser.getUser('user2')).resolves.toBeInstanceOf(User);
});

test('db savedplaces test', () => {
    return expect(dbPlace.getSavedPlaces('user1')).resolves.toBeDefined(); //toHaveLength(1)
});

test('db myplaces test', () => {
    return expect(dbPlace.getMyPlaces('user2')).resolves.toBeDefined(); //toHaveLength(1)
});

test('db feeds test', () => {
    return expect(dbFeed.getUserFeeds('user2')).resolves.toBeDefined();   //toHaveLength(5)
});

test('db notifications test', () => {
    return expect(dbNotification.getUserNotifications('user2')).resolves.toBeDefined();  //toHaveLength(1)
});

test('db lostpetnotify test', () => {
    return expect(dbLostPet.getLostPetNotificationsByUid('user1')).resolves.toBeDefined();  //toHaveLength(1)
});

test('db lostpetseen test', () => {
    return expect(dbLostPet.getLostPetsSeenByUid('user2')).resolves.toBeDefined();  //toHaveLength(1)
});

test('db useranimal test', () => {
    return expect(dbUserAnimal.getUserAnimals('user1')).resolves.toBeDefined(); //toHaveLength(1)
});

test('getdiseasedescription' , () => {
    return expect(dbUserAnimal.getDiseaseDescription('Disease1')).resolves.toHaveLength(1);
});

afterAll(() => {

})