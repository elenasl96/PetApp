export default class Animal {
  name: string;
  age: int;
  breed: string;
  size: string;
  photo: string;

  constructor(name, age, breed, size, photo, diseases) {
    this.name = name;
    this.age = age;
    this.breed = breed;
    this.size = size;
    this.photo = photo;
  }

  getName() {
    console.log(this.name);
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

  toFirestore() {
    return {
      name: this.name,
      age: this.age,
      breed: this.breed,
      size: this.size,
      photo: this.photo,
    };
  }
}
