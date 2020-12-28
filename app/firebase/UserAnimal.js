import Animal from './Animal.js';
export default class UserAnimal extends Animal{

   stats : {};   // dict   key is the name of the stats and value is an array of samples

   constructor(aid,name,age,breed,size,photo,diseases,stats){
             super(aid,name,age,breed,size,photo,diseases);
             this.stats = stats;
   }

   getStats(){
     return stats;
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
              stats : this.stats,
         };
   }

}