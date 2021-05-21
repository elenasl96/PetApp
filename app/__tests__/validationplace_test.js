import validator from "../shared/validation";

it('test place validation 1', () => { 
    expect(validator.isValid(validator.handlePlaceValidation("kennel1","description","photo","Street brera","Milan"))).toBeTruthy();
})

it('test place validation 2', () => { // false because description cannot be an empty string
    expect(validator.isValid(validator.handlePlaceValidation("kennel2","","photo","Street brera","Milan"))).toBeFalsy();
})

it('test place validation 3', () => { // false because city cannot be an empty string
    expect(validator.isValid(validator.handlePlaceValidation("kennel2","description","photo","Street brera",""))).toBeFalsy();
})
 
it('test place validation 4', () => { // false because photo must be not null
    expect(validator.isValid(validator.handlePlaceValidation("kennel2","description",null,"Street brera","Milan"))).toBeFalsy();
})