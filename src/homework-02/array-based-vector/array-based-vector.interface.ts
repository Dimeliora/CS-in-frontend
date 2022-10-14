export type Optional<T> = T | undefined;

export type Direction = 1 | -1;

export interface Vector<T> {
  length: number;
  get(index: number): Optional<T>;
  push(value: T): Vector<T>;
  pop(): Optional<T>;
  shift(): Optional<T>;
  unshift(value: T): Vector<T>;
  splice(start: number, removeCount: number, ...values: T[]): Vector<T>;

  debug(): void;
}
