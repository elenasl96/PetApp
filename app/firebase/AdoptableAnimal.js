import Animal from './Animal.js';
export default class AdoptableAnimal extends Animal{

   profile : string;

   constructor(aid,name,age,breed,size,photo,diseases,profile){
             super(aid,name,age,breed,size,photo,diseases);
             this.profile = profile;
   }

   getProfile(){
     return profile;
   }

   toFirestore() {
            return {
              aid : this.aid,
              name : this.name,
              age : this.age,
              breed : this.breed,
              size : this.size,
              photo : this.photo,
              diseases : this.diseases,
              profile : this.profile,
         };
   }

}