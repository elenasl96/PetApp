import validator from "../../shared/Validation";

it('test report validation 1', () => { 
    expect(validator.isValid(validator.handleReportValidation(3334141773,"sight"))).toBeTruthy();
})

it('test report validation 2', () => { // false because text must not be an empty string
    expect(validator.isValid(validator.handleReportValidation("number","sight"))).toBeFalsy();
})

it('test report validation 3', () => { // false because title must not be an empty string
    expect(validator.isValid(validator.handleReportValidation(3334141773,"loss","matteo"))).toBeTruthy();
})