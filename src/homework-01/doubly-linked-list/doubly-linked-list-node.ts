import type { DoublyLinkedListNode } from './doubly-linked-list.interface';

export default class DoublyLinkedListNodeImpl<T = unknown> implements DoublyLinkedListNode<T> {
  prev: DoublyLinkedListNode<T> | null = null;

  next: DoublyLinkedListNode<T> | null = null;

  constructor(public value: T) {}
}
