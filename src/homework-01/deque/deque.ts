import DoublyLinkedList from '../doubly-linked-list/doubly-linked-list';
import type Deque from './deque.interface';

export default class DequeImpl<T = unknown> implements Deque<T> {
  #list: DoublyLinkedList<T> = new DoublyLinkedList<T>();

  get isEmpty() {
    return this.#list.isEmpty;
  }

  insertLeft(value: T): this {
    this.#list.unshift(value);

    return this;
  }

  removeLeft() {
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

  removeRight() {
    const lastNode = this.#list.pop();

    if (lastNode === null) {
      throw new Error('Deque is empty');
    }

    return lastNode.value;
  }

  peekLeft() {
    return this.#list.head?.value ?? null;
  }

  peekRight() {
    return this.#list.tail?.value ?? null;
  }
}
