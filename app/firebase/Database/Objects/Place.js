export default class Place {

  constructor(
    name,
    type,
    description,
    photo,
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
    console.log(this.photo);
    if (this.photo && this.photo !== "") {
      return this.photo;
    } else {
      if (this.type === "Vet") {
        return "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/default%2Fvet.jpg?alt=media&token=b8650bba-e7b9-47b7-9d8c-252b8d92b84b";
      } else {
        return "https://firebasestorage.googleapis.com/v0/b/petapp-64e34.appspot.com/o/default%2Fkennel.jpg?alt=media&token=697f1b8e-5e07-45d3-8588-7154ccf83395";
      }
    }
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
      address: this.address,
      region: this.region,
    };
  }

  //utility
  isKennel() {
    return this.type === "Kennel";
  }
}
