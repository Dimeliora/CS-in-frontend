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

  it('Joining array elements with delimiter', () => {
    const array = new DynamicArray<number>(3);

    array.push(1);
    array.push(2);
    array.push(3);
    array.push(4);
    array.push(5);
    expect(array.join()).toBe('1, 2, 3, 4, 5');
    expect(array.join('-')).toBe('1-2-3-4-5');
  });

  it('Conversion array to string', () => {
    const array = new DynamicArray<number>(3);

    array.push(1);
    array.push(2);
    array.push(3);
    array.push(4);
    array.push(5);
    expect(String(array)).toBe('1, 2, 3, 4, 5');
  });

  it('Array instance must be iterable', () => {
    const array = new DynamicArray<number>(3);

    array.push(1);
    array.push(2);
    array.push(3);
    expect([...array]).toEqual([1, 2, 3]);
  });
});
