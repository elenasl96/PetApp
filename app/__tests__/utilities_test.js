
import utils from "../shared/utilities";

test('get age test', () => {
   expect(utils.getAgeString(4)).toBe('Young');
   expect(utils.getAgeString(8)).toBe('Medium');
   expect(utils.getAgeString(16)).toBe('Old');
});