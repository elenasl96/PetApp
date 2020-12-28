export default class User {

  name: string;
  photo: string;
  type: string;
  address: string;

  constructor(name, photo, type, address) {
    this.name = name;
    this.photo = photo;
    this.type = type;
    this.address = address;
  }

  // getters
  getName() {
    return name;
  }

  getPhoto() {
      return photo;
  }

  getType() {
    return type;
  }

  getAddress(){
    return address;
  }

  //serialize 
  toFirestore() {
    return {
      name: this.name,
      photo: this.photo,
      type: this.type,
      address: this.address,
    };
  }
}

