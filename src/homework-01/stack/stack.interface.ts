import { Nullable } from '../../utils/common.interface';

export default interface Stack<T> {
  isEmpty: boolean;
  isFull: boolean;
  push(value: T): Stack<T>;
  pop(): T;
  peek(): Nullable<T>;
}
