export default class Animal {

     aid : string;
     name : string;
     age : int;
     breed : string;
     size : string;
     photo : string;
     diseases : [];

     constructor(aid,name,age,breed,size,photo,diseases){
          this.aid = aid;
          this.name = name;
          this.age = age;
          this.breed = breed;
          this.size = size;
          this.photo = photo;
          this.diseases = diseases;
     }

     //getters

     getAid(){
       return aid;
     }

     getName(){
       return name;
     }

     getAge(){
       return age;
     }

     getBreed(){
       return breed;
     }

     getSize(){
       return size;
     }

     getPhoto(){
       return photo;
     }

     getDiseases(){
       return diseases;
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
      };
     }

}