export default class User {
  name: string;
  photo: string;
  type: string;
  address: string;
  days: int;
  lastlogin: string;

  constructor(name, photo, type, address, days, lastlogin) {
    this.name = name;
    this.photo = photo;
    this.type = type;
    this.address = address;
    this.days = days;
    this.lastlogin = lastlogin;
  }

  // getters
  getName() {
    return this.name;
  }

  getPhoto() {
    return this.photo;
  }

  getType() {
    return this.type;
  }

  getAddress() {
    return this.address;
  }

  getDays() {
    return this.days;
  }

  getLastLogin() {
    return this.lastlogin;
  }

  //serialize
  toFirestore() {
    return {
      name: this.name,
      photo: this.photo,
      type: this.type,
      address: this.address,
      days: this.days,
      lastlogin: this.lastlogin,
    };
  }
}
