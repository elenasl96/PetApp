import utils from "../shared/utilities";

test('utils test', () => {
   expect(utils.getAgeString(4)).toBe('Young');
   expect(utils.getAgeString(8)).toBe('Medium');
   expect(utils.getAgeString(16)).toBe('Old');
   expect(utils.timestamp()).toBeDefined();
   expect(utils.timestampAccurate()).toBeDefined();
   expect(utils.similarity("Via Belluno","Via Bellino")).toBeDefined();
});