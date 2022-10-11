import DoublyLinkedList from '../doubly-linked-list/doubly-linked-list';
import type Queue from './queue.interface';

export default class QueueImpl<T> implements Queue<T> {
  #queue: DoublyLinkedList<T> = new DoublyLinkedList();

  get isEmpty() {
    return this.#queue.isEmpty;
  }

  insert(value: T): this {
    this.#queue.unshift(value);

    return this;
  }

  remove() {
    const firstNode = this.#queue.pop();

    if (firstNode === null) {
      throw new Error('Queue is empty');
    }

    return firstNode.value;
  }

  peek() {
    return this.#queue.tail?.value ?? null;
  }
}
