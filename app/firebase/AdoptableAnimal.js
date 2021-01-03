import Animal from './Animal.js';
export default class AdoptableAnimal extends Animal{

   profile : string;

   constructor(name,age,breed,size,photo,profile){
             super(name,age,breed,size,photo);
             this.profile = profile;
   }

   getProfile(){
     return profile;
   }

   toFirestore() {
            return {
              name : this.name,
              age : this.age,
              breed : this.breed,
              size : this.size,
              photo : this.photo,
              profile : this.profile,
         };
   }

}