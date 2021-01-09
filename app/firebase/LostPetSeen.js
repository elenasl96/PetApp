export default class LostPetSeen {

     photo : string;
     size : string;
     color : string;
     breed : string;
     notes : string;
     place : string;
     timestamp : string;
     uid: string;
     email: string;
     phone: string;

     constructor(photo,size,color,breed,notes,place,timestamp,uid,email,phone){
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

     getPhoto(){
            return photo;
     }

     getSize(){
            return size;
     }

     getBreed(){
       return breed;
     }

     getNotes(){
       return notes;
     }

     getPlace(){
       return place;
     }

     getTimestamp(){
       return timestamp;
     }

     getUid(){
      return uid;
     }

     getEmail(){
      return email;
     }

     getPhone(){
      return phone;
     }

     toFirestore() {
         return {
                    photo : this.photo,
                    size : this.size,
                    color : this.color,
                    breed : this.breed,
                    notes : this.notes,
                    place : this.place,
                    timestamp : this.timestamp,
                    uid : this.uid,
                    email : this.email,
                    phone : this.phone,
      };
     }

}