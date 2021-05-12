
import {dbUser} from '../firebase/Database/Functions/dbUser';
import {User} from '../firebase/Database/Objects/User';

test('get user',() =>{
   dbUser.getUser('gbfBtH1XbDMYice2pM0zV7caEjn2').then((user) => {
      expect(user).toBeInstanceOf(User);
   });
});