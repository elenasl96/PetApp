export default class LostPetSeen {
  constructor(
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

  getColor() {
    return this.color;
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

  getCollection() {
    return "LostPetSeen";
  }

  toFirestore() {
    return {
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
