export default class Place {

  name: string;
  type : string;
  description: string;
  photo: string;
  uid: string;
  region: Object;

  constructor(name, type, description, photo, uid, latitude, longitude, latitudeDelta, longitudeDelta) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.photo = photo;
    this.uid = uid;
    this.region = {latitude: latitude, longitude: longitude, latitudeDelta: latitudeDelta, longitudeDelta: longitudeDelta};
  }

  // getters
  getName() {
    return name;
  }

  getType(){
    return type;
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
      type: this.type,
      description: this.description,
      photo: this.photo,
      uid: this.uid,
      region: this.region,
    };
  }
}

