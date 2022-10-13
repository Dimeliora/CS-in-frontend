export type MapArrayCallback<T, U> = (element: T, index: number, array: DynamicArray<T>) => U;

export type FilterArrayCallback<T> = (element: T, index: number, array: DynamicArray<T>) => boolean;

export interface DynamicArray<T> {
  length: number;
  push(value: T): DynamicArray<T>;
  pop(): T | undefined;
  get(index: number): T | undefined;
  join(glue?: string): string;
  map<U>(cb: MapArrayCallback<T, U>): DynamicArray<U>;
  filter(cb: FilterArrayCallback<T>): DynamicArray<T>;
  values(): Iterator<T>;
  toString(): string;
}
