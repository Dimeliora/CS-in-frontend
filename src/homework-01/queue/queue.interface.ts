import { Nullable } from '../../utils/common.interface';

export default interface Queue<T> {
  isEmpty: boolean;
  enqueue(value: T): Queue<T>;
  dequeue(): T;
  peek(): Nullable<T>;
}
