import { Nullable } from '../../utils/common.interface';

export type Key = string | number;

export type KeyMapFunction = (keys: Key) => number;

export interface Structure<T> {
  set(key: Key, value: T): void;
  get(key: Key): Nullable<T>;
}
