export default interface Queue<T> {
  isEmpty: boolean;
  enqueue(value: T): Queue<T>;
  dequeue(): T;
  peek(): T | null;
}
