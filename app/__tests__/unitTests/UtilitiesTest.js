import utils from "../../shared/Utilities";

class Obj {
  constructor(latitude,longitude,distance) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.distance = distance;
  }
}

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
  let pointT = new Obj(0,0,0);
  let pointA = new Obj(10,30,0);
  let pointB = new Obj(10,20,0);
  pointA.distance = utils.calcDistance(pointA,pointT);
  pointB.distance = utils.calcDistance(pointB,pointT);
  expect(utils.compareDistance(pointA,pointB)).toBe(1); //pointB is closer to pointT than pointA
});
