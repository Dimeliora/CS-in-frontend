export default interface Queue<T> {
  isEmpty: boolean;
  enqueue(value: T): Queue<T>;
  dequeue(): T | null;
  peek(): T | null;
}
