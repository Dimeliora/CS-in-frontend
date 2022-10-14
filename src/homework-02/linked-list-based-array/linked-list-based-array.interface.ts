export type Optional<T> = T | undefined;

export type MapArrayCallback<T, U> = (element: T, index: number, array: DynamicArray<T>) => U;

export type FilterArrayCallback<T> = (element: T, index: number, array: DynamicArray<T>) => boolean;

export interface DynamicArray<T> {
  length: number;
  get(index: number): Optional<T>;
  push(value: T): DynamicArray<T>;
  pop(): Optional<T>;
  shift(): Optional<T>;
  unshift(value: T): DynamicArray<T>;
  map<U>(cb: MapArrayCallback<T, U>): DynamicArray<U>;
  filter(cb: FilterArrayCallback<T>): DynamicArray<T>;
  join(glue?: string): string;
  values(): Iterator<T>;
  toString(): string;
}
