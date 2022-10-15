import { DoublyLinkedList } from '../../homework-01';
import type { HashTable } from './hash-table.interface';

export default class HashTableImpl<T> implements HashTable<T> {
  #hashArray: DoublyLinkedList<[string, T]>[];

  #hashArraySize: number;

  #keysCount: number = 0;

  #maxFillRate: number = 2;

  #hashArrayExtendCoeff: number = 2;

  #hashMapCoeff = 37;

  constructor(size: number = 10) {
    if (size <= 0 || !Number.isInteger(size)) {
      throw new Error('Invalid hash array size value provided');
    }

    this.#hashArraySize = size;
    this.#hashArray = Array<DoublyLinkedList<[string, T]>>(size);

    for (let index = 0; index < this.#hashArray.length; index += 1) {
      this.#hashArray[index] = new DoublyLinkedList<[string, T]>();
    }
  }

  get fillRate() {
    return this.#keysCount / this.#hashArraySize;
  }

  #hashKeyToIndex(key: string) {
    const keyChars = [...key];
    let keyToNumberMap = 0;

    for (let index = 0; index < keyChars.length; index += 1) {
      const charCode = keyChars[index].codePointAt(0) ?? 1;
      keyToNumberMap = (keyToNumberMap * this.#hashMapCoeff + charCode) % this.#hashArraySize;
    }

    return keyToNumberMap;
  }

  set(key: any, value: T) {
    const stringifiedKey = String(key);
    const index = this.#hashKeyToIndex(stringifiedKey);
    const hashArrayList = this.#hashArray[index];
    const entry = hashArrayList.find(([entryKey]) => entryKey === stringifiedKey);

    if (entry) {
      hashArrayList.replace(([entryKey]) => entryKey === stringifiedKey, [stringifiedKey, value]);
    } else {
      hashArrayList.push([stringifiedKey, value]);
    }

    return this;
  }

  get(key: any) {
    const stringifiedKey = String(key);
    const index = this.#hashKeyToIndex(stringifiedKey);
    const hashArrayList = this.#hashArray[index];
    const entry = hashArrayList.find(([entryKey]) => entryKey === stringifiedKey);

    return entry?.value[1];
  }

  *entries() {
    for (const list of this.#hashArray) {
      yield* list.values();
    }
  }

  *keys() {
    for (const [key] of this.entries()) {
      yield key;
    }
  }

  *values() {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }
}
