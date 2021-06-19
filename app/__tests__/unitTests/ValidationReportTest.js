import validator from "../../shared/Validation";

it('test report validation 1', () => { 
    expect(validator.isValid(validator.handleReportValidation(3334141773,"sight","matteo","place","city"))).toBeTruthy();
})

it('test report validation 2', () => { // false because text must not be an empty string
    expect(validator.isValid(validator.handleReportValidation("number","sight"))).toBeFalsy();
})

it('test report validation 3', () => { // false because place must not be an empty string
    expect(validator.isValid(validator.handleReportValidation(3334141773,"loss","matteo",null,"city"))).toBeFalsy();
})

it('test report validation 3', () => { // false because city must not be empty
    expect(validator.isValid(validator.handleReportValidation(3334141773,"loss","matteo","place",null))).toBeFalsy();
})

/*handleReportValidation(phone, reportType, name, place, city) {
    let errors = {};

    if (reportType === "loss" && !name.match(/^[a-zA-Z]+$/)) {
      errors["name"] = "Only letters in name";
    }

    if (isNaN(phone)) {
      errors["number"] = "Telephone must be a number";
    }

    if (!place || !city) {
      errors["place"] = "Insert valid address and city";
    }

    return errors;
  },*/