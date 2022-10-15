import { Nullable } from '../../utils/common.interface';
import DoublyLinkedListNodeImpl from './doubly-linked-list-node';
import type { DoublyLinkedList, DoublyLinkedListNode, Predicate } from './doubly-linked-list.interface';

export default class DoublyLinkedListImpl<T = unknown> implements DoublyLinkedList<T>, Iterable<T> {
  #head: Nullable<DoublyLinkedListNode<T>> = null;

  #tail: Nullable<DoublyLinkedListNode<T>> = null;

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

  find(cb: Predicate<T>) {
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

  insertBefore(cb: Predicate<T>, newValue: T) {
    const nodeBefore = this.find(cb);

    if (!nodeBefore) {
      return false;
    }

    if (nodeBefore.prev === null) {
      this.unshift(newValue);

      return true;
    }

    const newNode = new DoublyLinkedListNodeImpl(newValue);
    newNode.next = nodeBefore;
    newNode.prev = nodeBefore.prev;
    newNode.prev.next = newNode;
    nodeBefore.prev = newNode;

    return true;
  }

  insertAfter(cb: Predicate<T>, newValue: T) {
    const nodeAfter = this.find(cb);

    if (!nodeAfter) {
      return false;
    }

    if (nodeAfter.next === null) {
      this.push(newValue);
      return true;
    }

    const newNode = new DoublyLinkedListNodeImpl(newValue);
    newNode.next = nodeAfter.next;
    nodeAfter.next.prev = newNode;
    newNode.prev = nodeAfter;
    nodeAfter.next = newNode;

    return true;
  }

  remove(cb: Predicate<T>) {
    const nodeToRemove = this.find(cb);

    if (nodeToRemove) {
      if (nodeToRemove.prev === null) {
        return this.shift();
      }

      if (nodeToRemove.next === null) {
        return this.pop();
      }

      [nodeToRemove.next.prev, nodeToRemove.prev.next] = [nodeToRemove.prev, nodeToRemove.next];

      return nodeToRemove;
    }

    return null;
  }

  replace(cb: Predicate<T>, newValue: T) {
    const nodeToReplace = this.find(cb);

    if (!nodeToReplace) {
      return false;
    }

    nodeToReplace.value = newValue;

    return true;
  }

  reverse(): this {
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
