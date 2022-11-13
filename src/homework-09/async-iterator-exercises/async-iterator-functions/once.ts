export default function once<E extends keyof HTMLElementEventMap>(
  source: HTMLElement,
  eventType: E,
): AsyncIterable<HTMLElementEventMap[E]> {
  return {
    [Symbol.asyncIterator]() {
      let isEventFired = false;

      return {
        async next(): Promise<IteratorResult<HTMLElementEventMap[E]>> {
          return new Promise((resolve) => {
            if (isEventFired) {
              resolve({ done: true, value: undefined });
              return;
            }

            source.addEventListener(
              eventType,
              (event) => {
                isEventFired = true;
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
