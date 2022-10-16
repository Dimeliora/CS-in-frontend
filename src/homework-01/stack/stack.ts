import type { Nullable } from '../../utils/common.types';

export default class StackImpl<T = unknown> {
  #stack: T[];

  #stackPointer: number = -1;

  constructor(maxStackSize: number) {
    if (maxStackSize <= 0 || !Number.isInteger(maxStackSize)) {
      throw new Error('Invalid stack size value provided');
    }

    this.#stack = Array(maxStackSize);
  }

  get isEmpty(): boolean {
    return this.#stackPointer === -1;
  }

  get isFull(): boolean {
    return this.#stack.length === this.#stackPointer + 1;
  }

  push(value: T): this {
    if (this.isFull) {
      throw new Error('Maximum stack size exceeded');
    }

    this.#stackPointer += 1;
    this.#stack[this.#stackPointer] = value;

    return this;
  }

  pop(): T {
    if (this.isEmpty) {
      throw new Error('Stack is empty');
    }

    const peekValue = this.#stack[this.#stackPointer];
    this.#stackPointer -= 1;

    return peekValue;
  }

  peek(): Nullable<T> {
    if (this.isEmpty) {
      return null;
    }

    return this.#stack[this.#stackPointer];
  }
}
