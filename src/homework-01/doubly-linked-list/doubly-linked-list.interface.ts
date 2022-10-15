import { Nullable } from '../../utils/common.interface';

export type Predicate<T> = (value: T) => boolean;

export interface DoublyLinkedListNode<T> {
  value: T;
  prev: Nullable<DoublyLinkedListNode<T>>;
  next: Nullable<DoublyLinkedListNode<T>>;
}

export interface DoublyLinkedList<T> {
  head: Nullable<DoublyLinkedListNode<T>>;
  tail: Nullable<DoublyLinkedListNode<T>>;
  isEmpty: boolean;
  clean(): DoublyLinkedList<T>;
  push(value: T): DoublyLinkedList<T>;
  pop(): Nullable<DoublyLinkedListNode<T>>;
  unshift(value: T): DoublyLinkedList<T>;
  shift(): Nullable<DoublyLinkedListNode<T>>;
  insertBefore(cb: Predicate<T>, newValue: T): boolean;
  insertAfter(cb: Predicate<T>, newValue: T): boolean;
  find(cb: Predicate<T>): Nullable<DoublyLinkedListNode<T>>;
  remove(cb: Predicate<T>): Nullable<DoublyLinkedListNode<T>>;
  replace(cb: Predicate<T>, newValue: T): boolean;
  reverse(): DoublyLinkedList<T>;
  values(): IterableIterator<T>;
  reversedValues(): IterableIterator<T>;
}
