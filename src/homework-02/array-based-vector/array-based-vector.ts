/* eslint-disable no-param-reassign */
import type { Optional, Direction, Vector } from './array-based-vector.interface';

export default class VectorImpl<T> implements Vector<T>, Iterable<T> {
  #length: number = 0;

  #capacity: number;

  #buffer: Optional<T>[];

  #capacityGrowCoeff: number = 2;

  constructor(size: number = 10) {
    if (size <= 0 || !Number.isInteger(size)) {
      throw new Error('Invalid capacity value provided');
    }

    this.#capacity = size;
    this.#buffer = Array<Optional<T>>(size);
  }

  get length() {
    return this.#length;
  }

  #extendBuffer(multiplier: number = 1) {
    this.#capacity *= this.#capacityGrowCoeff * multiplier;
    const extendedBuffer = Array<Optional<T>>(this.#capacity);

    let index = this.#length - 1;
    while (index >= 0) {
      extendedBuffer[index] = this.#buffer[index];
      index -= 1;
    }

    this.#buffer = extendedBuffer;
  }

  #checkoutBufferExtension(requiredLength: number) {
    if (this.#capacity < this.#length + requiredLength) {
      const multiplier = Math.floor((this.#length + requiredLength - 1) / this.#capacity);
      this.#extendBuffer(multiplier);
    }
  }

  #moveBy(direction: Direction, step: number, start: number = 0) {
    if (step === 0) return;

    const isForward = direction === 1;
    if (isForward) {
      this.#checkoutBufferExtension(step);
    }

    let index = isForward ? this.#length - 1 : start;
    for (index; isForward ? index >= start : index < this.#length; index -= direction) {
      if (this.#buffer[index] !== undefined) {
        const minIndexValue = Math.max(start, index + step * direction);
        this.#buffer[minIndexValue] = this.#buffer[index];
        this.#buffer[index] = undefined;
      }
    }
  }

  get(index: number) {
    return this.#buffer[index];
  }

  push(...values: T[]): this {
    this.#checkoutBufferExtension(values.length);

    for (let index = 0; index < values.length; index += 1) {
      this.#buffer[this.#length + index] = values[index];
    }

    this.#length += values.length;

    return this;
  }

  pop() {
    const lastValue = this.#buffer[this.#length - 1];
    if (lastValue === undefined) return lastValue;

    this.#buffer[this.#length - 1] = undefined;
    this.#length -= 1;

    return lastValue;
  }

  shift() {
    const [firstValue] = this.#buffer;
    this.#moveBy(-1, 1);
    this.#length -= 1;

    return firstValue;
  }

  unshift(...values: T[]): this {
    this.#checkoutBufferExtension(values.length);

    this.#moveBy(1, values.length);

    for (let index = 0; index < values.length; index += 1) {
      this.#buffer[index] = values[index];
    }

    this.#length += values.length;

    return this;
  }

  splice(start: number, removeCount: number, ...values: T[]) {
    const removedValues = new VectorImpl<Optional<T>>(this.#capacity);

    if (start > this.#length) return removedValues;

    if (start < 0) start = this.#length + start;

    if (removeCount === undefined) removeCount = start < 0 ? Math.abs(start) : this.#length - start;

    if (removeCount <= 0) {
      this.#moveBy(1, values.length, start);

      for (let index = 0; index < values.length; index += 1) {
        this.#buffer[start + index] = values[index];
      }

      this.#length += values.length;
    } else {
      const moveDirection = <Direction>Math.sign(values.length - removeCount);
      const offset = Math.abs(values.length - removeCount);

      for (let index = start; index < start + removeCount; index += 1) {
        removedValues.push(this.#buffer[index]);
      }

      this.#moveBy(moveDirection, offset, start);

      for (let index = 0; index < values.length; index += 1) {
        this.#buffer[index + start] = values[index];
      }

      this.#length += values.length - removeCount;
      if (values.length === 0) {
        this.#buffer[this.#length] = undefined;
      }
    }

    return removedValues;
  }

  *[Symbol.iterator]() {
    for (let index = 0; index < this.#length; index += 1) {
      const value = this.#buffer[index];

      if (value !== undefined) {
        yield value;
      }
    }
  }

  debug() {
    console.log(this.#buffer);
    console.log('Capacity: ', this.#capacity);
    console.log('Length: ', this.#length);
  }
}
