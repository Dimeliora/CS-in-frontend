import { DoublyLinkedList } from '../../homework-01';
import type { Optional } from '../../utils/common.types';

export default class HashTableImpl<T> {
  #hashArray: DoublyLinkedList<[string, T]>[] = [];

  #keysCount: number = 0;

  #maxFillRate: number = 2;

  #hashArrayExtendCoeff: number = 2;

  #hashMapCoeff = 37;

  #hashArraySize: number;

  constructor(size: number = 10) {
    if (size <= 0 || !Number.isInteger(size)) {
      throw new Error('Invalid hash array size value provided');
    }

    this.#hashArraySize = size;
    this.#prepareHashArray();
  }

  get #fillRate(): number {
    return this.#keysCount / this.#hashArraySize;
  }

  #prepareHashArray(): void {
    this.#hashArray = Array<DoublyLinkedList<[string, T]>>(this.#hashArraySize);

    for (let index = 0; index < this.#hashArray.length; index += 1) {
      this.#hashArray[index] = new DoublyLinkedList<[string, T]>();
    }
  }

  #hashKeyToIndex(key: string): number {
    const keyChars = [...key];
    let keyToNumberMap = 0;

    for (let index = 0; index < keyChars.length; index += 1) {
      const charCode = keyChars[index].codePointAt(0) ?? 1;
      keyToNumberMap = (keyToNumberMap * this.#hashMapCoeff + charCode) % this.#hashArraySize;
    }

    return keyToNumberMap;
  }

  #checkoutTableRehashing(): void {
    const prevHashArray = this.#hashArray;
    this.#hashArraySize *= this.#hashArrayExtendCoeff;
    this.#keysCount = 0;

    this.#prepareHashArray();

    for (const list of prevHashArray) {
      for (const [key, value] of list) {
        this.set(key, value);
      }
    }
  }

  #getHashArrayList(key: any): [DoublyLinkedList<[string, T]>, string] {
    const stringifiedKey = String(key);
    const index = this.#hashKeyToIndex(stringifiedKey);
    const hashArrayList = this.#hashArray[index];

    return [hashArrayList, stringifiedKey];
  }

  set(key: unknown, value: T): this {
    if (this.#fillRate > this.#maxFillRate) {
      this.#checkoutTableRehashing();
    }

    const [hashArrayList, stringifiedKey] = this.#getHashArrayList(key);
    const entry = hashArrayList.find(([entryKey]) => entryKey === stringifiedKey);

    if (entry) {
      hashArrayList.replace(([entryKey]) => entryKey === stringifiedKey, [stringifiedKey, value]);
    } else {
      hashArrayList.push([stringifiedKey, value]);
      this.#keysCount += 1;
    }

    return this;
  }

  get(key: unknown): Optional<T> {
    const [hashArrayList, stringifiedKey] = this.#getHashArrayList(key);
    const entry = hashArrayList.find(([entryKey]) => entryKey === stringifiedKey);

    return entry?.value[1];
  }

  remove(key: unknown): boolean {
    const [hashArrayList, stringifiedKey] = this.#getHashArrayList(key);
    const removedEntry = hashArrayList.remove(([entryKey]) => entryKey === stringifiedKey);

    if (removedEntry) {
      this.#keysCount -= 1;
      return true;
    }

    return false;
  }

  *entries(): Generator<[string, T]> {
    for (const list of this.#hashArray) {
      yield* list.values();
    }
  }

  *keys(): Generator<string> {
    for (const [key] of this.entries()) {
      yield key;
    }
  }

  *values(): Generator<T> {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }
}
