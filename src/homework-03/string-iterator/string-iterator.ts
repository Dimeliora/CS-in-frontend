import type { Nullable } from '../../utils/common.types';

export default class StringIterator {
  static #firstSurrogateRange = [0xd800, 0xdbff];

  static #secondSurrogateRange = [0xdc00, 0xdfff];

  static #isFirstSurrogate(code: number): boolean {
    return code >= StringIterator.#firstSurrogateRange[0] && code <= StringIterator.#firstSurrogateRange[1];
  }

  static #isSecondSurrogate(code: number): boolean {
    return code >= StringIterator.#secondSurrogateRange[0] && code <= StringIterator.#secondSurrogateRange[1];
  }

  static iterate(string: string): IterableIterator<string> {
    let firstSurrogate: Nullable<number> = null;
    let pointer = 0;

    return {
      next(): IteratorResult<string> {
        if (pointer >= string.length) return { done: true, value: undefined };

        const charCode = string.charCodeAt(pointer);
        if (StringIterator.#isFirstSurrogate(charCode)) {
          firstSurrogate = charCode;
          pointer += 1;

          return this.next();
        }

        if (StringIterator.#isSecondSurrogate(charCode)) {
          pointer += 1;

          if (firstSurrogate !== null) {
            const value = String.fromCharCode(firstSurrogate, charCode);
            firstSurrogate = null;

            return { done: false, value };
          }

          return this.next();
        }

        const char = String.fromCharCode(charCode);
        firstSurrogate = null;
        pointer += 1;

        return { done: false, value: char };
      },
      [Symbol.iterator](): IterableIterator<string> {
        return this;
      },
    };
  }
}
