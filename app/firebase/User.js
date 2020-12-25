export default class User {
  name: string;
  photo: string;

  constructor(name, photo) {
    this.name = name;
    this.photo = photo;
  }

  // getters
  getName() {
    return name;
  }

  getPassword() {
    return age;
  }

  getPhoto() {
    return photo;
  }

  //serialize and deserialize
  toFirestore() {
    return {
      name: this.name,
      photo: this.photo,
    };
  }
}
