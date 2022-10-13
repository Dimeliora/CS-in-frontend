import { DoublyLinkedList } from '../../homework-01';
import type { ArrayElementValue, DynamicArray } from './linked-list-based-array.interface';

export default class DynamicArrayImpl<T = unknown> implements DynamicArray<T>, Iterable<ArrayElementValue<T>> {
  #list: DoublyLinkedList<ArrayElementValue<T>[]> = new DoublyLinkedList<ArrayElementValue<T>[]>();

  #length: number = 0;

  #chunkSize: number;

  constructor(size: number) {
    if (size <= 0 || !Number.isInteger(size)) {
      throw new Error('Invalid chunk size value provided');
    }

    this.#chunkSize = size;
  }

  get length() {
    return this.#length;
  }

  #addChunk(): T[] {
    const newChunk = Array<T>(this.#chunkSize);
    this.#list.push(newChunk);
    return newChunk;
  }

  #getLastElementPosition(index: number): [number, ArrayElementValue<T>[]] | null {
    const iterator = this.#list.values();
    const chunkElementIndex = index % this.#chunkSize;
    let chunkCounter = Math.floor(index / this.#chunkSize);
    let currentChunk = iterator.next().value;

    while (chunkCounter > 0) {
      currentChunk = iterator.next().value;
      chunkCounter -= 1;
    }

    if (!currentChunk) {
      return null;
    }

    return [chunkElementIndex, currentChunk];
  }

  push(value: T): this {
    const lastElementPosition = this.#getLastElementPosition(this.#length - 1);
    if (lastElementPosition !== null) {
      const [lastElementIndex, lastChunk] = lastElementPosition;

      if (lastElementIndex < this.#chunkSize - 1) {
        lastChunk[lastElementIndex + 1] = value;
        this.#length += 1;

        return this;
      }
    }

    const lastChunk = this.#addChunk();
    lastChunk[0] = value;
    this.#length += 1;

    return this;
  }

  pop() {
    const lastElementPosition = this.#getLastElementPosition(this.#length - 1);
    if (lastElementPosition === null) {
      return undefined;
    }

    const [lastElementIndex, lastChunk] = lastElementPosition;
    const lastElement = lastChunk[lastElementIndex];
    lastChunk[lastElementIndex] = undefined;
    this.#length -= 1;

    if (lastChunk[0] === undefined) {
      this.#list.pop();
    }

    return lastElement;
  }

  get(index: number) {
    const lastElementPosition = this.#getLastElementPosition(index);
    if (lastElementPosition === null) {
      return undefined;
    }

    const [lastElementIndex, lastChunk] = lastElementPosition;

    return lastChunk[lastElementIndex];
  }

  join(glue: string = ', ') {
    let stringifiedArray = '';

    for (const chunk of this.#list.values()) {
      let stringifiedChunk = '';

      for (let index = 0; index < this.#chunkSize; index += 1) {
        if (index > 0 && chunk[index] !== undefined) {
          stringifiedChunk += glue;
        }

        if (chunk[index] !== undefined) {
          stringifiedChunk += chunk[index];
        }
      }

      if (stringifiedArray.length > 0) {
        stringifiedArray += glue;
      }

      stringifiedArray += stringifiedChunk;
    }

    return stringifiedArray;
  }

  toString() {
    return this.join();
  }

  *[Symbol.iterator]() {
    for (const chunk of this.#list.values()) {
      for (let index = 0; index < this.#chunkSize; index += 1) {
        if (chunk[index] !== undefined) {
          yield chunk[index];
        }
      }
    }
  }
}
