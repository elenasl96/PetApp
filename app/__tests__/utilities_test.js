import utils from "../shared/utilities";

test("utils test", () => {
  expect(utils.getAgeString(4)).toBe("Young");
  expect(utils.getAgeString(8)).toBe("Medium");
  expect(utils.getAgeString(16)).toBe("Old");
  expect(utils.timestamp()).toBeDefined();
  expect(utils.timestampAccurate()).toBeDefined();

  //Test map search
  expect(utils.similarity("Via Belluno", "Via Bellino")).toBeDefined();
  expect(utils.searchInPlaces("ConfortHouse", "confort")).toBeTruthy();
  expect(utils.searchInPlaces("ConfortHouse", "House")).toBeTruthy();
  expect(utils.searchInPlaces("ConfortHouse", "pets")).toBeFalsy;
  expect(utils.searchInPlaces("PetVeterinary", "Pet Vet")).toBeTruthy();
  expect(utils.searchInPlaces("PetVeterinary", "Park")).toBeFalsy();
});
