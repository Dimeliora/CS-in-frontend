function* createGenerator<T>(
  iterator: Iterator<T>,
  execTime: number,
  callback: (iterableElement: T) => void,
): Generator<'timeout', undefined> {
  let { done, value } = iterator.next();
  let startTime = performance.now();

  while (true) {
    if (done) return;

    callback(value);

    if (performance.now() - startTime > execTime) {
      yield 'timeout';
      startTime = performance.now();
    }

    ({ done, value } = iterator.next());
  }
}

function iterate<T>(generator: Generator<T>, releaseTime: number, resolve: (value?: any) => void): void {
  const { done } = generator.next();

  if (!done) {
    setTimeout(() => {
      iterate(generator, releaseTime, resolve);
    }, releaseTime);
  } else {
    resolve();
  }
}

export default function forEach<T>(iterable: Iterable<T>, callback: (iterableElement: T) => void): Promise<void> {
  const EXEC_TIME = 100;
  const RELEASE_TIME = 100;
  const iterator = iterable[Symbol.iterator]();

  const generator = createGenerator(iterator, EXEC_TIME, callback);

  return new Promise((resolve) => {
    iterate(generator, RELEASE_TIME, resolve);
  });
}
