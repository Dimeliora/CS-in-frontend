import StringIterator from './string-iterator';

describe('String iterator implementation', () => {
  it('Iterator must iterate strings of regular chars', () => {
    const string = 'Foobar';

    expect([...StringIterator.iterate(string)]).toEqual(['F', 'o', 'o', 'b', 'a', 'r']);
  });

  it('Iterator must iterate strings of surrogate pairs', () => {
    const string = 'ππ§‘π';

    expect([...StringIterator.iterate(string)]).toEqual(['π', 'π§‘', 'π']);
  });

  it('Iterator must iterate mixed strings', () => {
    const string = 'F: π R: π';

    expect([...StringIterator.iterate(string)]).toEqual(['F', ':', ' ', 'π', ' ', 'R', ':', ' ', 'π']);
  });

  it('Iterator must ignore surrogates without the pair', () => {
    const stringOne = `F: ${'π'[1]} R: π`;
    const stringTwo = `F: π R: ${'π'[0]}`;

    expect([...StringIterator.iterate(stringOne)]).toEqual(['F', ':', ' ', ' ', 'R', ':', ' ', 'π']);
    expect([...StringIterator.iterate(stringTwo)]).toEqual(['F', ':', ' ', 'π', ' ', 'R', ':', ' ']);
  });

  it('Iterator must iterate strings with combining characters', () => {
    // Character 'ΠΉ' is a character 'ΠΈ' with breve added
    const string = 'ΠΈΜΠΎΠ³';

    expect(string.length).toBe(4);
    expect([...StringIterator.iterate(string)]).toEqual(['ΠΉ', 'ΠΎ', 'Π³']);
  });
});
