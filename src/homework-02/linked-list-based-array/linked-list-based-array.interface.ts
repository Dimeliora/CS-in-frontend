export type Optional<T> = T | undefined;

export type MapArrayCallback<T, U> = (element: T, index: number, array: DynamicArray<T>) => U;

export type FilterArrayCallback<T> = (element: T, index: number, array: DynamicArray<T>) => boolean;

export interface DynamicArray<T> {
  length: number;
  push(value: T): DynamicArray<T>;
  pop(): T | undefined;
  shift(): T | undefined;
  // unshift(value: T): DynamicArray<T>;
  // splice(start: number, end: number): DynamicArray<T>;
  get(index: number): T | undefined;
  join(glue?: string): string;
  map<U>(cb: MapArrayCallback<T, U>): DynamicArray<U>;
  filter(cb: FilterArrayCallback<T>): DynamicArray<T>;
  values(): Iterator<T>;
  toString(): string;
}
