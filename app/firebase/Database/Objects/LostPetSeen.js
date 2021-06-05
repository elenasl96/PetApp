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
    phone,
    latitude,
    longitude
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
    this.latitude = latitude;
    this.longitude = longitude;
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

  getLat() {
    return this.latitude;
  }

  getLng() {
    return this.longitude;
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
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
