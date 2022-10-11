export default interface Deque<T> {
  insertLeft(value: T): Deque<T>;
  removeLeft(): T;
  insertRight(value: T): Deque<T>;
  removeRight(): T;
  peekLeft(): T | null;
  peekRight(): T | null;
}
