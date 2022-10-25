import type { ExtractIterablesType } from '../iterator.types';

export default function zip<T extends Iterable<unknown>[]>(
  ...iterables: T
): IterableIterator<ExtractIterablesType<T>[]> {
  const iterators: Iterator<unknown>[] = [];

  return {
    next(): IteratorResult<ExtractIterablesType<T>[]> {
      if (iterables.length === 0) {
        return { done: true, value: undefined };
      }

      if (iterators.length === 0) {
        for (const iterableItem of iterables) {
          iterators.push(iterableItem[Symbol.iterator]());
        }
      }

      let isFinished = true;
      const iteratorsValue: ExtractIterablesType<T>[] = [];
      for (const iteratorItem of iterators) {
        const { done, value } = iteratorItem.next();

        const typedValue = <ExtractIterablesType<T>>value;
        if (!done) isFinished = false;
        iteratorsValue.push(typedValue);
      }

      return isFinished ? { done: true, value: undefined } : { done: false, value: iteratorsValue };
    },
    [Symbol.iterator](): IterableIterator<ExtractIterablesType<T>[]> {
      return this;
    },
  };
}
