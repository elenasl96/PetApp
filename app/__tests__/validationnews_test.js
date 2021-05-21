import validator from "../shared/validation";

it('test news validation 1', () => { 
    expect(validator.isValid(validator.handleNewsValidation("title1","text1"))).toBeTruthy();
})

it('test news validation 2', () => { // false because text must not be an empty string
    expect(validator.isValid(validator.handleNewsValidation("title2",""))).toBeFalsy();
})

it('test news validation 3', () => { // false because title must not be an empty string
    expect(validator.isValid(validator.handleNewsValidation("","text3"))).toBeFalsy();
})
 
