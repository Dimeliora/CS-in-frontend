export default function on<E extends keyof HTMLElementEventMap>(
  source: HTMLElement,
  eventType: E,
): AsyncIterable<HTMLElementEventMap[E]> {
  return {
    [Symbol.asyncIterator]() {
      return {
        async next(): Promise<IteratorResult<HTMLElementEventMap[E]>> {
          return new Promise((resolve) => {
            source.addEventListener(
              eventType,
              (event) => {
                resolve({ done: false, value: event });
              },
              { once: true },
            );
          });
        },
      };
    },
  };
}
