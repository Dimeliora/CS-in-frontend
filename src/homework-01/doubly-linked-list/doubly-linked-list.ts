import DoublyLinkedListNodeImpl from './doubly-linked-list-node';
import type { DoublyLinkedList, DoublyLinkedListNode } from './doubly-linked-list.interface';

export default class DoublyLinkedListImpl<T> implements DoublyLinkedList<T>, Iterable<T> {
  #head: DoublyLinkedListNode<T> | null = null;

  #tail: DoublyLinkedListNode<T> | null = null;

  #size: number = 0;

  constructor(iterable?: Iterable<T>) {
    // eslint-disable-next-line eqeqeq
    if (iterable == undefined) {
      return;
    }

    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('Object is not iterable');
    }

    for (const value of iterable) {
      this.push(value);
    }
  }

  // TODO
  get head() {
    return this.#head;
  }

  // TODO
  get tail() {
    return this.#tail;
  }

  get size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  push(value: T): this {
    const newNode = new DoublyLinkedListNodeImpl(value);

    if (!this.#head) {
      this.#head = newNode;
    }

    if (this.#tail) {
      this.#tail.next = newNode;
      newNode.prev = this.#tail;
    }

    this.#tail = newNode;
    this.#size += 1;

    return this;
  }

  pop() {
    if (!this.#tail) {
      return null;
    }

    const lastNode = this.#tail;
    if (!lastNode.prev) {
      this.#head = null;
    } else {
      lastNode.prev.next = null;
    }

    this.#tail = lastNode.prev;
    this.#size -= 1;

    return lastNode;
  }

  unshift(value: T): this {
    const newNode = new DoublyLinkedListNodeImpl(value);

    if (!this.#tail) {
      this.#tail = newNode;
    }

    if (this.#head) {
      newNode.next = this.#head;
      this.#head.prev = newNode;
    }

    this.#head = newNode;
    this.#size += 1;

    return this;
  }

  shift() {
    if (!this.#head) {
      return null;
    }

    const firstNode = this.#head;
    if (!firstNode.next) {
      this.#tail = null;
    } else {
      firstNode.next.prev = null;
    }

    this.#head = firstNode.next;
    this.#size -= 1;

    return firstNode;
  }

  reverse() {
    if (this.#size < 2) {
      return this;
    }

    let currentNode = this.#tail;
    this.#tail = this.#head;
    this.#head = currentNode;

    let prevNode: DoublyLinkedListNode<T> | null;

    for (let index = 0; index < this.#size; index += 1) {
      prevNode = currentNode?.prev ?? null;

      if (currentNode) {
        currentNode.prev = currentNode.next;
        currentNode.next = prevNode;
      }

      currentNode = prevNode;
    }

    return this;
  }

  *values(): Iterator<T> {
    let currentNode = this.#head;

    while (currentNode) {
      yield currentNode.value;
      currentNode = currentNode.next;
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.values();
  }
}
