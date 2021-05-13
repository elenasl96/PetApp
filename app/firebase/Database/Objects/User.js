export default class User {

  constructor(name, photo, type, address, days, lastlogin, notificationtoken) {
    this.name = name;
    this.photo = photo;
    this.type = type;
    this.address = address;
    this.days = days;
    this.lastlogin = lastlogin;
    this.notificationtoken = notificationtoken;
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

  getNotificationToken() {
    return this.notificationToken;
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
      notificationtoken: this.notificationtoken,
    };
  }
}
