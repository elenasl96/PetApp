export default class Place {
  name: string;
  type: string;
  description: string;
  photo: string;
  uid: string;
  address: string;
  region: Object;

  constructor(
    name,
    type,
    description,
    photo,
    uid,
    address,
    latitude,
    longitude,
    latitudeDelta,
    longitudeDelta
  ) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.photo = photo;
    this.uid = uid;
    this.address = address;
    this.region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    };
  }

  // getters
  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getDescription() {
    return this.description;
  }

  getPhoto() {
    return this.photo;
  }

  getUid() {
    return this.uid;
  }

  getAddress() {
    return this.address;
  }

  getRegion() {
    return this.region;
  }

  getLatLng() {
    return {
      latitude: this.region.latitude,
      longitude: this.region.longitude,
    };
  }

  //serialize
  toFirestore() {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      photo: this.photo,
      uid: this.uid,
      address: this.address,
      region: this.region,
    };
  }

  //utility
  isKennel() {
    return this.type == "kennel";
  }
}
