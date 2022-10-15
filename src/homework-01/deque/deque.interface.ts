import { Nullable } from '../../utils/common.interface';

export interface Deque<T> {
  insertLeft(value: T): Deque<T>;
  removeLeft(): T;
  insertRight(value: T): Deque<T>;
  removeRight(): T;
  peekLeft(): Nullable<T>;
  peekRight(): Nullable<T>;
}
