export type Predicat<T> = (value: T) => boolean;

export interface DoublyLinkedListNode<T = unknown> {
  value: T;
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export interface DoublyLinkedList<T = unknown> {
  head: DoublyLinkedListNode<T> | null;
  tail: DoublyLinkedListNode<T> | null;
  isEmpty: boolean;
  clean(): DoublyLinkedList;
  push(value: T): DoublyLinkedList;
  pop(): DoublyLinkedListNode<T> | null;
  unshift(value: T): DoublyLinkedList;
  shift(): DoublyLinkedListNode<T> | null;
  insertBefore(cb: Predicat<T>, newValue: T): boolean;
  insertAfter(cb: Predicat<T>, newValue: T): boolean;
  find(cb: Predicat<T>): DoublyLinkedListNode<T> | null;
  remove(cb: Predicat<T>): DoublyLinkedListNode<T> | null;
  reverse(): DoublyLinkedList;
  values(): Iterator<T>;
  reversedValues(): Iterator<T>;
}
