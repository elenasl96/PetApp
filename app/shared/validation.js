const validator = {


isValid(errors){

    let isValid = true;
    for (const [key, value] of Object.entries(errors)) {
        if (value !== null)
          isValid = false;
    }
    return isValid;
},

handlePetValidation: function(name,age,photo,adoptable,profile) {

    let errors = {};
    errors["name"] = null;
    errors["age"] = null;
    errors["photo"] = null;
    errors["profile"] = null;

    //Name
    if (name == "") {
      errors["name"] = "Name cannot be empty";
    } else if (!name.match(/^[a-zA-Z]+$/)) {
      errors["name"] = "Only letters in name";
    }

    //Age

    if (age == "") {

      errors["age"] = "Age cannot be empty";
    } else if (isNaN(age)) {
      errors["age"] = "Age must be a number";
    } else if (
      age > 20 ||
      age < 0 ||
      !Number.isInteger(Number(age))
    ) {
      errors["age"] = "Age is an integer between 0 and 20 ";
    }

    if (adoptable && !profile) {
      errors["profile"] = "Profile cannot be empty";
    }

    if (photo == null) {
        errors["photo"] = "You must load a photo";
    }

    return errors;

  },

  handleNewsValidation(title,text) {
    let errors = {};
    errors["title"] = null;
    errors["text"] = null;

    //title
    if (title == "") {
      errors["title"] = "Title cannot be empty";
    }

    //text
    if (text == "") {
      errors["text"] = "Text cannot be empty";
    }

    return errors;
  },

  
  handlePlaceValidation(name,description,photo,address,city) {
    let errors = {};
    errors["name"] = null;
    errors["description"] = null;
    errors["address"] = null;

    // Name
    if (name == "") {
      errors["name"] = "Name cannot be empty";
    }

    // Description
    if (description == "") {
      errors["description"] = "Description cannot be empty";
    }

    if (photo == null) {
        errors["photo"] = "You must load a photo";
    }

    // Address
    if (address == "" || city == "") {
      errors["address"] = "Address cannot be empty";
    }
    
    return errors;

  },

  handleReportValidation(phone,reportType,name) {
    let errors = {};

    if (reportType === "loss" && !name.match(/^[a-zA-Z]+$/)) {
      errors["name"] = "Only letters in name";
    }

    if (isNaN(phone)) {
      errors["number"] = "Telephone must be a number";
    }

    return errors;
  },

  handlePhotoValidation(photo){

    let errors = {};
    if (photo == null) {
        errors["photo"] = "You must load a photo";
    }
    return errors;

  },


};

export default validator;