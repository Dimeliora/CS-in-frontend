export default interface Queue<T = unknown> {
  isEmpty: boolean;
  insert(value: T): Queue<T>;
  remove(): T | null;
  peek(): T | null;
}
