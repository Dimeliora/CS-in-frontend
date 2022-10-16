import DoublyLinkedList from '../doubly-linked-list/doubly-linked-list';
import type { Nullable } from '../../utils/common.types';

export default class DequeImpl<T = unknown> {
  #list: DoublyLinkedList<T> = new DoublyLinkedList<T>();

  insertLeft(value: T): this {
    this.#list.unshift(value);

    return this;
  }

  removeLeft(): T {
    const firstNode = this.#list.shift();

    if (firstNode === null) {
      throw new Error('Deque is empty');
    }

    return firstNode.value;
  }

  insertRight(value: T): this {
    this.#list.push(value);

    return this;
  }

  removeRight(): T {
    const lastNode = this.#list.pop();

    if (lastNode === null) {
      throw new Error('Deque is empty');
    }

    return lastNode.value;
  }

  peekLeft(): Nullable<T> {
    return this.#list.head?.value ?? null;
  }

  peekRight(): Nullable<T> {
    return this.#list.tail?.value ?? null;
  }
}
