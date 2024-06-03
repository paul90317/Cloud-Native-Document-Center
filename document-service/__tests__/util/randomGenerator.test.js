const generateString = require('../../util/randomGenerator');

describe('generateString Function', () => {
  it('should return a string of the correct length', () => {
    const length = 10;
    const result = generateString(length);
    expect(result).toHaveLength(length);
  });

  it('should contain only valid characters', () => {
    const length = 10;
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = generateString(length);
    for (let char of result) {
      expect(validCharacters.includes(char)).toBe(true);
    }
  });

  it('should generate a different string on subsequent calls', () => {
    const length = 10;
    const result1 = generateString(length);
    const result2 = generateString(length);
    expect(result1).not.toEqual(result2);
  });
});
