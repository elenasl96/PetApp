import Animal from './Animal.js';
export default class AdoptableAnimal extends Animal{

   profile : string;

   constructor(name,age,breed,size,color,photo,type,profile){
             super(name,age,breed,size,color,photo,type);
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
              color : this.color,
              photo : this.photo,
              type: this.type,
              profile : this.profile,
         };
   }

}