import type { ExtractIterablesType } from '../iterator.types';

export default function seq<T extends Iterable<any>[]>(...iterables: T): IterableIterator<ExtractIterablesType<T>> {
  let iterableCount = 0;
  let currentIterator: Iterator<unknown> | null = null;

  return {
    next(): IteratorResult<ExtractIterablesType<T>> {
      if (iterableCount >= iterables.length) return { done: true, value: undefined };

      if (currentIterator === null) {
        currentIterator = iterables[iterableCount][Symbol.iterator]();
      }

      const { done, value } = currentIterator.next();
      if (done) {
        iterableCount += 1;
        currentIterator = null;
        return this.next();
      }

      const typedValue = <ExtractIterablesType<T>>value;
      return { done: false, value: typedValue };
    },
    [Symbol.iterator](): IterableIterator<ExtractIterablesType<T>> {
      return this;
    },
  };
}
