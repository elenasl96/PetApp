
const mockFunctions = {

    handlePetValidation: function(name,age,adoptable,profile) {

        let errors = {};
        errors["name"] = null;
        errors["age"] = null;
        let formIsValid = true;
        //Name
        if (name == "") {
          formIsValid = false;
          errors["name"] = "Name cannot be empty";
        } else if (!name.match(/^[a-zA-Z]+$/)) {
          formIsValid = false;
          errors["name"] = "Only letters in name";
        }
    
        //Age
    
        if (age == "") {
          formIsValid = false;
          errors["age"] = "Age cannot be empty";
        } else if (isNaN(age)) {
          formIsValid = false;
          errors["age"] = "Age must be a number";
        } else if (
          age > 20 ||
          age < 0 ||
          !Number.isInteger(Number(age))
        ) {

          formIsValid = false;
          errors["age"] = "Age is an integer between 0 and 20 ";
        }
    
        if (adoptable && !profile) {
          errors["profile"] = "Profile cannot be empty";
        }

        return formIsValid;},
    
  };

  export default mockFunctions;