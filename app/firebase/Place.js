export default class Place {

  name: string;
  description: string;
  photo: string;
  uid: string;
  region: Object;

  constructor(name, description, photo, uid, latitude, longitude, latitudeDelta, longitudeDelta) {
    this.name = name;
    this.description = description;
    this.photo = photo;
    this.uid = uid;
    this.region = {latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta};
  }

  // getters
  getName() {
    return name;
  }

  getDescription(){
    return description;
  }

  getPhoto() {
      return photo;
  }

  getUid(){
      return uid;
  }

  getRegion(){
      return region;
  }

  //serialize
  toFirestore() {
    return {
      name: this.name,
      description: this.description,
      photo: this.photo,
      uid: this.uid,
      region: this.region,
    };
  }
}

