import DoublyLinkedListNodeImpl from './doubly-linked-list-node';
import type { DoublyLinkedList, DoublyLinkedListNode, Predicat } from './doubly-linked-list.interface';

export default class DoublyLinkedListImpl<T> implements DoublyLinkedList<T>, Iterable<T> {
  #head: DoublyLinkedListNode<T> | null = null;

  #tail: DoublyLinkedListNode<T> | null = null;

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

  *#iterateListNodes(direction: 'forward' | 'backward' = 'forward') {
    let currentNode = direction === 'forward' ? this.#head : this.#tail;

    while (currentNode !== null) {
      yield currentNode;
      currentNode = direction === 'forward' ? currentNode.next : currentNode.prev;
    }

    return null;
  }

  get head() {
    const nodeClone = this.#head ? { ...this.#head } : null;
    return Object.freeze(nodeClone);
  }

  get tail() {
    const nodeClone = this.#tail ? { ...this.#tail } : null;
    return Object.freeze(nodeClone);
  }

  get isEmpty() {
    return this.#head === null;
  }

  clean(): this {
    this.#head = null;
    this.#tail = null;

    return this;
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

    return firstNode;
  }

  insertBefore(cb: Predicat<T>, newValue: T) {
    const iterator = this.#iterateListNodes();
    let currentNode = iterator.next().value;

    while (currentNode) {
      if (cb(currentNode?.value)) {
        if (currentNode.prev === null) {
          this.unshift(newValue);
          return true;
        }

        const newNode = new DoublyLinkedListNodeImpl(newValue);
        newNode.next = currentNode;
        newNode.prev = currentNode.prev;
        newNode.prev.next = newNode;
        currentNode.prev = newNode;
        return true;
      }

      currentNode = iterator.next().value;
    }

    return false;
  }

  insertAfter(cb: Predicat<T>, newValue: T) {
    const iterator = this.#iterateListNodes();
    let currentNode = iterator.next().value;

    while (currentNode) {
      if (cb(currentNode?.value)) {
        if (currentNode.next === null) {
          this.push(newValue);
          return true;
        }

        const newNode = new DoublyLinkedListNodeImpl(newValue);
        newNode.next = currentNode.next;
        currentNode.next.prev = newNode;
        newNode.prev = currentNode;
        currentNode.next = newNode;
        return true;
      }

      currentNode = iterator.next().value;
    }

    return false;
  }

  find(cb: Predicat<T>) {
    const iterator = this.#iterateListNodes();
    let currentNode = iterator.next().value;

    while (currentNode) {
      if (cb(currentNode.value)) {
        return currentNode;
      }

      currentNode = iterator.next().value;
    }

    return null;
  }

  remove(cb: Predicat<T>) {
    const iterator = this.#iterateListNodes();
    let currentNode = iterator.next().value;

    while (currentNode) {
      if (cb(currentNode.value)) {
        if (currentNode.prev === null) {
          return this.shift();
        }

        if (currentNode.next === null) {
          return this.pop();
        }

        [currentNode.next.prev, currentNode.prev.next] = [currentNode.prev, currentNode.next];
        return currentNode;
      }

      currentNode = iterator.next().value;
    }

    return null;
  }

  reverse() {
    if (this.#head === this.#tail) {
      return this;
    }

    const iterator = this.#iterateListNodes('backward');
    let currentNode = iterator.next().value;

    this.#tail = this.#head;
    this.#head = currentNode;

    let prevNode: DoublyLinkedListNode<T> | null;

    while (currentNode) {
      prevNode = iterator.next().value;

      if (currentNode) {
        currentNode.prev = currentNode.next;
        currentNode.next = prevNode;
      }

      currentNode = prevNode;
    }

    return this;
  }

  *values() {
    for (const node of this.#iterateListNodes()) {
      yield node.value;
    }
  }

  *reversedValues() {
    for (const node of this.#iterateListNodes('backward')) {
      yield node.value;
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}
