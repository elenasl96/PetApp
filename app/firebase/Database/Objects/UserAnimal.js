export default class Animal {
  name: string;
  age: int;
  breed: string;
  size: string;
  color: string;
  photo: string;
  type: string;

  constructor(name, age, breed, size, color, photo,type) {
    this.name = name;
    this.age = age;
    this.breed = breed;
    this.size = size;
    this.color = color;
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

  getColor(){
    return this.color;
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
      color: this.color,
      photo: this.photo,
      type: this.type,
    };
  }
}
