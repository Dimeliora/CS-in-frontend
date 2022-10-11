export type Predicate<T> = (value: T) => boolean;

export interface DoublyLinkedListNode<T> {
  value: T;
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export interface DoublyLinkedList<T> {
  head: DoublyLinkedListNode<T> | null;
  tail: DoublyLinkedListNode<T> | null;
  isEmpty: boolean;
  clean(): DoublyLinkedList<T>;
  push(value: T): DoublyLinkedList<T>;
  pop(): DoublyLinkedListNode<T> | null;
  unshift(value: T): DoublyLinkedList<T>;
  shift(): DoublyLinkedListNode<T> | null;
  insertBefore(cb: Predicate<T>, newValue: T): boolean;
  insertAfter(cb: Predicate<T>, newValue: T): boolean;
  find(cb: Predicate<T>): DoublyLinkedListNode<T> | null;
  remove(cb: Predicate<T>): DoublyLinkedListNode<T> | null;
  reverse(): DoublyLinkedList<T>;
  values(): Iterator<T>;
  reversedValues(): Iterator<T>;
}
