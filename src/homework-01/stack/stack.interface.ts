export default interface Stack<T = unknown> {
  isEmpty: boolean;
  isFull: boolean;
  push(value: T): Stack<T>;
  pop(): T;
  peek(): T | null;
}
