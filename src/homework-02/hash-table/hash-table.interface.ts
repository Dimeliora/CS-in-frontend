export type Optional<T> = T | undefined;

export interface HashTable<T> {
  set(key: any, value: T): this;
  get(key: any): Optional<T>;
  remove(key: any): boolean;
  entries(): IterableIterator<[string, T]>;
  keys(): IterableIterator<string>;
  values(): IterableIterator<T>;
}
