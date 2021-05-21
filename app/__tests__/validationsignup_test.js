import validator from "../shared/validation";

it('test signup validation 1', () => { 
    expect(validator.isValid(validator.handleSignUpValidation("name","email","password","user","photo","email"))).toBeTruthy();
})

it('test signup validation 2', () => { // true because signuptype is not email , so email and password can be empty
    expect(validator.isValid(validator.handleSignUpValidation("name","","","user",null))).toBeTruthy();
})

it('test signup validation 3', () => { // false because email cannot be an empty string
    expect(validator.isValid(validator.handleSignUpValidation("name","","password","user","photo","email"))).toBeFalsy();
})
 
it('test signup validation 4', () => { // false because password cannot be an empty string
    expect(validator.isValid(validator.handleSignUpValidation("name","email","","user","photo","email"))).toBeFalsy();
})