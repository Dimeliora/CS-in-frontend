import DoublyLinkedList from '../doubly-linked-list/doubly-linked-list';
import type { Nullable } from '../../utils/common.types';

export default class QueueImpl<T = unknown> {
  #list: DoublyLinkedList<T> = new DoublyLinkedList<T>();

  enqueue(value: T): this {
    this.#list.unshift(value);

    return this;
  }

  dequeue(): T {
    const firstNode = this.#list.pop();

    if (firstNode === null) {
      throw new Error('Queue is empty');
    }

    return firstNode.value;
  }

  peek(): Nullable<T> {
    return this.#list.tail?.value ?? null;
  }
}
