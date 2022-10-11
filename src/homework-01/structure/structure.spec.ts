import Structure from './structure';

describe('Structure implementation through code generation', () => {
  it('Attempt to construct structure without keys provided', () => {
    // @ts-ignore
    expect(() => new Structure()).toThrowError('Keys must be provided');
  });

  it('Set value by key', () => {
    const structure = new Structure<string | number>('name', 'age');

    structure.set('name', 'John');
    expect(structure.get('name')).toBe('John');
    expect(structure.get('age')).toBeNull();
  });

  it('Attempt to get value by unexisting key', () => {
    const structure = new Structure<string | number>('name');

    expect(() => structure.get('age')).toThrowError('Key not found');
  });

  it('Attempt to set value by unexisting key', () => {
    const structure = new Structure<string | number>('name');

    expect(() => structure.set('age', 25)).toThrowError('Key not found');
  });
});
