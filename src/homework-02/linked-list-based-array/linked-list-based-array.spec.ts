import DynamicArray from './linked-list-based-array';

describe('Dynamic array implementation with doubly linked list', () => {
  it('Attempt to construct array with invalid chunk size value', () => {
    expect(() => new DynamicArray(0)).toThrowError('Invalid chunk size value provided');
    expect(() => new DynamicArray(2.3)).toThrowError('Invalid chunk size value provided');
  });

  it('Pushing value into array', () => {
    const array = new DynamicArray<number>(3);

    array.push(1);
    array.push(2);
    expect(array.get(0)).toBe(1);
    expect(array.get(1)).toBe(2);
    expect(array.get(2)).toBeUndefined();
    expect(array.length).toBe(2);
  });

  it('Popping value from array', () => {
    const array = new DynamicArray<number>(3);

    array.push(1);
    array.push(2);
    expect(array.pop()).toBe(2);
    expect(array.pop()).toBe(1);
    expect(array.pop()).toBeUndefined();
    expect(array.length).toBe(0);
  });

  it('Shifting value from array', () => {
    const array = new DynamicArray<number>(5);

    for (let i = 1; i <= 5; i += 1) {
      array.push(i);
    }

    expect(array.shift()).toBe(1);
    expect(array.shift()).toBe(2);
    expect(array.shift()).toBe(3);
    expect(array.shift()).toBe(4);
    expect(array.shift()).toBe(5);
    expect(array.length).toBe(0);
  });

  it('Joining array elements with delimiter', () => {
    const array = new DynamicArray<number>(3);

    for (let i = 1; i <= 5; i += 1) {
      array.push(i);
    }

    expect(array.join()).toBe('1,2,3,4,5');
    expect(array.join('-')).toBe('1-2-3-4-5');
  });

  it('Conversion array to string', () => {
    const array = new DynamicArray<number>(3);

    for (let i = 1; i <= 5; i += 1) {
      array.push(i);
    }

    expect(String(array)).toBe('1,2,3,4,5');
  });

  it('Mapping array to another one (without mutation of the original one)', () => {
    const array = new DynamicArray<string>(5);
    const string = 'hello';

    for (const char of string) {
      array.push(char);
    }

    const upperCased = array.map((char) => char.toUpperCase());
    expect(upperCased.join('')).toBe('HELLO');
    expect(array.join('')).toBe(string);

    const partiallyUpperCased = array.map((char, index) => (index % 2 !== 0 ? char.toUpperCase() : char));
    expect(partiallyUpperCased.join('')).toBe('hElLo');
  });

  it('Filtering array (without mutation of the original one)', () => {
    const array = new DynamicArray<string>(5);
    const string = 'hello';
    const vowels = ['a', 'e', 'i', 'o', 'u'];

    for (const char of string) {
      array.push(char);
    }

    const withoutVowels = array.filter((char) => !vowels.includes(char));
    expect(withoutVowels.join('')).toBe('hll');
    expect(array.join('')).toBe(string);

    const firstThreeChars = array.filter((_, index) => index < 3);
    expect(firstThreeChars.join('')).toBe('hel');
  });

  it('Array instance must be iterable', () => {
    const array = new DynamicArray<number>(3);

    for (let i = 1; i <= 5; i += 1) {
      array.push(i);
    }

    expect([...array]).toEqual([1, 2, 3, 4, 5]);
  });
});
