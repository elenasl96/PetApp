export default class Animal {
  name: string;
  age: int;
  breed: string;
  size: string;
  photo: string;
  type: string;

  constructor(name, age, breed, size, photo,type) {
    this.name = name;
    this.age = age;
    this.breed = breed;
    this.size = size;
    this.photo = photo;
    this.type = type;
  }

  getName() {
    return this.name;
  }

  getAge() {
    return this.age;
  }

  getBreed() {
    return this.breed;
  }

  getSize() {
    return this.size;
  }

  getPhoto() {
    return this.photo;
  }

  getType(){
    return this.type;
  }

  toFirestore() {
    return {
      name: this.name,
      age: this.age,
      breed: this.breed,
      size: this.size,
      photo: this.photo,
      type: this.type,
    };
  }
}
