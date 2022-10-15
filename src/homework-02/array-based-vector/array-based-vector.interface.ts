import { Optional } from '../../utils/common.interface';

export type Direction = 1 | -1;

export type MapVectorCallback<T, U> = (element: T, index: number, vector: Vector<T>) => U;

export type FilterVectorCallback<T> = (element: T, index: number, vector: Vector<T>) => boolean;

export interface Vector<T> {
  length: number;
  get(index: number): Optional<T>;
  push(value: T): Vector<T>;
  pop(): Optional<T>;
  shift(): Optional<T>;
  unshift(value: T): Vector<T>;
  splice(start?: number, removeCount?: number, ...values: T[]): Vector<T>;
  join(glue?: string): string;
  map<U>(cb: MapVectorCallback<T, U>): Vector<U>;
  filter(cb: FilterVectorCallback<T>): Vector<T>;
  toString(): string;
  values(): IterableIterator<T>;
}
