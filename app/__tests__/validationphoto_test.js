import validator from "../shared/validation";

it('test photo validation 1', () => { 
    expect(validator.isValid(validator.handlePhotoValidation("photo"))).toBeTruthy();
})

it('test photo validation 2', () => { // false because text must not be an empty string
    expect(validator.isValid(validator.handlePhotoValidation(null))).toBeFalsy();
})

