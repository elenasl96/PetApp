import dbUser from "../../firebase/database/functions/DbUser";
import dbUserAnimal from "../../firebase/database/functions/DbUserAnimal";
import dbAdoptableAnimal from "../../firebase/database/functions/DbAdoptableAnimal";
import dbFeed from "../../firebase/database/functions/DbFeed";
import dbLostPet from "../../firebase/database/functions/DbLostPet";
import dbNews from "../../firebase/database/functions/DbNews";
import dbNotification from "../../firebase/database/functions/DbNotification";
import dbPlace from "../../firebase/database/functions/DbPlace";


beforeAll(() => {
    /*
    dbPlace.addPlace('place1',
    'Kennel',
    'description of a kennel',
    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
    'viale romagna 2',
    41.0,
    41.3).then((place) => {

    //creates standard user , he saves the place and adds feeds
    dbUser.addUser('user1',
                   'test',
                   'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
                   'user',
                   'via calici 10').then((user1) => {
                     dbPlace.addSavedPlace('user1',place.id);
                     dbFeed.getFeeds([],'user1','15/05/2021',0);
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
                    'phone',41.0,42.0);
    
    dbLostPet.addLostPetSeen('https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
    'Big',
    'White',
    'Golden Retriever',
    '',
    'Moscova',
    'user2',
    'user2@gmail.com',
    'phone',41.0,42.0);
    
      */
})

afterAll(() => {
    /*
    dbUser.deleteUser('user1','user');
    dbUser.deleteUser('user2','business');
    dbLostPet.deleteLostPetNotificationByUid('user1');
    dbLostPet.deleteLostPetSeenByUid('user2');
     */
})


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
    return expect(dbUserAnimal.getDiseaseDescription('Cancer','Cat')).resolves.toHaveLength(1);
});

