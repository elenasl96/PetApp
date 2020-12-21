export default class User{

    name: string;
    password: string;
    photo : string;

    constructor(name,password,photo) {
        this.name = name;
        this.password = password;
        this.photo = photo;
    }

// getters
    getName(){
       return name;
    }

    getPassword(){
       return age;
    }

    getPhoto(){
       return photo;
    }

//serialize and deserialize
    toFirestore(){
        return {
            name: this.name,
            password: this.password,
            photo : this.photo
         }
    }

}

