
import dbUser from "../firebase/Database/Functions/dbUser";
import dbUserAnimal from "../firebase/Database/Functions/dbUserAnimal";
import User from "../firebase/Database/Objects/User";


beforeEach(() => {

    dbUser.addUser('aaa',
                   'test',
                   'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
                   'user',
                   'via calici 10');
})

test('db user test', () => {
    return expect(dbUser.getUser('aaa')).resolves.toBeInstanceOf(User);
});

beforeEach(() => {
    dbUserAnimal.addUserAnimal('aaa',
    'test',
    10,
    'Labrador',
    'Medium',
    'Black',
    'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=3596224033779591&height=100&width=100&ext=1618930868&hash=AeS7Ycc-xZFda11qK44',
    'Dog').then((doc) => {
        dbUserAnimal.addAnimalStatSample('aaa',doc.id,'weight',30);
        dbUserAnimal.addAnimalStatSample('aaa',doc.id,'height',30);
        dbUserAnimal.addAnimalDisease('aaa',doc.id,'Disease1');
    });
})

test('db useranimal test', () => {
    return expect(dbUserAnimal.getUserAnimals('aaa')).resolves.toBeDefined(); //toHaveLength(1)
});

test('getdiseasedescription' , () => {
    return expect(dbUserAnimal.getDiseaseDescription('Disease1')).resolves.toHaveLength(1);
});

afterAll(() => {
   dbUser.deleteUser('aaa');
})