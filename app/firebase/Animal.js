export default class Animal {

     name : string;
     age : int;
     breed : string;
     size : string;
     photo : string;

     constructor(name,age,breed,size,photo,diseases){
          this.name = name;
          this.age = age;
          this.breed = breed;
          this.size = size;
          this.photo = photo;
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


     toFirestore() {
         return {
           name : this.name,
           age : this.age,
           breed : this.breed,
           size : this.size,
           photo : this.photo,
      };
     }

}