import DoublyLinkedList from '../doubly-linked-list/doubly-linked-list';
import type Queue from './queue.interface';

export default class QueueImpl<T = unknown> implements Queue<T> {
  #list: DoublyLinkedList<T> = new DoublyLinkedList<T>();

  get isEmpty() {
    return this.#list.isEmpty;
  }

  enqueue(value: T): this {
    this.#list.unshift(value);

    return this;
  }

  dequeue() {
    const firstNode = this.#list.pop();

    if (firstNode === null) {
      throw new Error('Queue is empty');
    }

    return firstNode.value;
  }

  peek() {
    return this.#list.tail?.value ?? null;
  }
}
