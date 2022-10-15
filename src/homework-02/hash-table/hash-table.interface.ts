export type Optional<T> = T | undefined;

export interface HashTable<T> {
  fillRate: number;
  set(key: any, value: T): this;
  get(key: any): Optional<T>;
  entries(): IterableIterator<[string, T]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<T>;
}
