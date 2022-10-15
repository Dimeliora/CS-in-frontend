import HashTable from './hash-table';

describe('Dynamic array implementation with doubly linked list', () => {
  it('Attempt to construct hash table with invalid hash array size value', () => {
    expect(() => new HashTable(0)).toThrowError('Invalid hash array size value provided');
    expect(() => new HashTable(2.3)).toThrowError('Invalid hash array size value provided');
  });

  it('Adding values into hash table by keys', () => {
    const hash = new HashTable<any>(10);

    hash.set('foo', 42);
    hash.set(123, true);
    hash.set(false, [1, 2, 3]);
    expect(hash.get('foo')).toBe(42);
    expect(hash.get(123)).toBe(true);
    expect(hash.get(false)).toEqual([1, 2, 3]);
  });

  it('Replacing values in hash table', () => {
    const hash = new HashTable<any>(10);

    hash.set('hello', 'world');
    hash.set(42, true);
    expect(hash.get('hello')).toBe('world');
    expect(hash.get(42)).toBe(true);

    hash.set('hello', 'username');
    hash.set(42, false);
    expect(hash.get('hello')).toBe('username');
    expect(hash.get(42)).toBe(false);
  });
});
