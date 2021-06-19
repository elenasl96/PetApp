import utils from "../../shared/Utilities";

test("utils test", () => {
  expect(utils.getAgeString(2017)).toBe("Young");
  expect(utils.getAgeString(2013)).toBe("Medium");
  expect(utils.getAgeString(2005)).toBe("Old");
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
