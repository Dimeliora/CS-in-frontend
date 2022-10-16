import type { Nullable } from '../../utils/common.types';

export default class DoublyLinkedListNodeImpl<T = unknown> {
  prev: Nullable<DoublyLinkedListNodeImpl<T>> = null;

  next: Nullable<DoublyLinkedListNodeImpl<T>> = null;

  constructor(public value: T) {}
}
