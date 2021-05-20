
import mockFunctions from '../__mock__/mockFunctions';

it('test validation 1', () => {
  expect(mockFunctions.handlePetValidation("Willy",8,true,"profile")).toBeTruthy();
})

it('test validation 2', () => {
  expect(mockFunctions.handlePetValidation("Willy","eight",true,"profile")).toBeFalsy();
})
