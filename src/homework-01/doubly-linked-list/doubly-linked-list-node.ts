import { Nullable } from '../../utils/common.interface';

import type { DoublyLinkedListNode } from './doubly-linked-list.interface';

export default class DoublyLinkedListNodeImpl<T = unknown> implements DoublyLinkedListNode<T> {
  prev: Nullable<DoublyLinkedListNode<T>> = null;

  next: Nullable<DoublyLinkedListNode<T>> = null;

  constructor(public value: T) {}
}
