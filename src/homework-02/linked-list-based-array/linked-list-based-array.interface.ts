export type ArrayElementValue<T> = T | undefined;

export interface DynamicArray<T> {
  length: number;
  push(value: T): DynamicArray<T>;
  pop(): T | undefined;
  get(index: number): T | undefined;
  join(glue?: string): string;
  toString(): string;
}
