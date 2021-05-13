export default class LostPetNotify {

  constructor(
    name,
    photo,
    size,
    color,
    breed,
    notes,
    place,
    timestamp,
    uid,
    email,
    phone
  ) {
    this.name = name;
    this.photo = photo;
    this.size = size;
    this.color = color;
    this.breed = breed;
    this.notes = notes;
    this.place = place;
    this.timestamp = timestamp;
    this.uid = uid;
    this.email = email;
    this.phone = phone;
  }

  getName() {
    return this.name;
  }

  getPhoto() {
    return this.photo;
  }

  getSize() {
    return this.size;
  }

  getBreed() {
    return this.breed;
  }

  getNotes() {
    return this.notes;
  }

  getPlace() {
    return this.place;
  }

  getTimestamp() {
    return this.timestamp;
  }

  getUid() {
    return this.uid;
  }

  getEmail() {
    return this.email;
  }

  getPhone() {
    return this.phone;
  }

  toFirestore() {
    return {
      name: this.name,
      photo: this.photo,
      size: this.size,
      color: this.color,
      breed: this.breed,
      notes: this.notes,
      place: this.place,
      timestamp: this.timestamp,
      uid: this.uid,
      email: this.email,
      phone: this.phone,
    };
  }
}
