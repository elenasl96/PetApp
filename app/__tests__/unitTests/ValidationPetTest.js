import validator from "../../shared/Validation";

it('test pet validation 1', () => { 
    expect(validator.isValid(validator.handlePetValidation("Willy",8,"photo",true,"profile"))).toBeTruthy();
})

it('test pet validation 2', () => { // false because age must be a number
    expect(validator.isValid(validator.handlePetValidation("Willy","eight","photo",true,"profile"))).toBeFalsy();
})

it('test pet validation 3', () => { // true profile field is null but animal is not adoptable so it's ok
    expect(validator.isValid(validator.handlePetValidation("Willy",8,"photo",false,null))).toBeTruthy();
})
 
it('test pet validation 4', () => { // false because if the animal is adoptable must have a profile field not null
    expect(validator.isValid(validator.handlePetValidation("Willy",8,"photo",true,null))).toBeFalsy();
})