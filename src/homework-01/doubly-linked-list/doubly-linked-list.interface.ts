export interface DoublyLinkedListNode<T = unknown> {
  value: T;
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export interface DoublyLinkedList<T = unknown> {
  head: DoublyLinkedListNode<T> | null;
  tail: DoublyLinkedListNode<T> | null;
  isEmpty(): boolean;
  clean(): DoublyLinkedList;
  push(value: T): DoublyLinkedList;
  pop(): DoublyLinkedListNode<T> | null;
  unshift(value: T): DoublyLinkedList;
  shift(): DoublyLinkedListNode<T> | null;
  insertBefore(valueAfter: T, newValue: T): boolean;
  insertAfter(valueBefore: T, newValue: T): boolean;
  find(value: T): DoublyLinkedListNode<T> | null;
  remove(value: T): DoublyLinkedListNode<T> | null;
  reverse(): DoublyLinkedList;
  values(): Iterator<T>;
  reversedValues(): Iterator<T>;
}
