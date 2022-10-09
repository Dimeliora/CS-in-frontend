export interface DoublyLinkedListNode<T = unknown> {
  value: T;
  prev: DoublyLinkedListNode<T> | null;
  next: DoublyLinkedListNode<T> | null;
}

export interface DoublyLinkedList<T = unknown> {
  head: DoublyLinkedListNode<T> | null;
  tail: DoublyLinkedListNode<T> | null;
  size: number;
  isEmpty(): boolean;
  push(value: T): DoublyLinkedList;
  pop(): DoublyLinkedListNode<T> | null;
  unshift(value: T): DoublyLinkedList;
  shift(): DoublyLinkedListNode<T> | null;
  reverse(): DoublyLinkedList;
  values(): Iterator<T>;
}
