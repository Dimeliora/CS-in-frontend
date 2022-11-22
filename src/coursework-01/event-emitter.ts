import EventHandlersProviderImpl from './event-handlers-providers/event-handlers-provider.js';
import type {
  EventHandlersProvider,
  EventEmitterOptions,
  EventHandler,
  EventUnsubscriber,
  HandlerOrder,
} from './interfaces.js';

export default class EventEmitter {
  #eventHandlersProvider: EventHandlersProvider;

  #anyEventsFirst: boolean;

  constructor({
    namespaces = false,
    namespaceDelimiter = '.',
    maxListeners = 0,
    relatedEventsTimeout = 0,
    anyEventsFirst = false,
  }: EventEmitterOptions = {}) {
    this.#anyEventsFirst = anyEventsFirst;

    const eventHandlersProviderOptions = { namespaces, namespaceDelimiter, maxListeners, relatedEventsTimeout };
    this.#eventHandlersProvider = new EventHandlersProviderImpl(eventHandlersProviderOptions);
  }

  #createEventUnsubscriber(event: string | string[], handler: EventHandler): EventUnsubscriber<this> {
    const off = Array.isArray(event)
      ? () => this.#eventHandlersProvider.removeRelatedEventsHandler(event)
      : () => this.#eventHandlersProvider.removeEventHandler(event, handler);
    return {
      eventEmitter: this,
      event,
      handler,
      off,
    };
  }

  #subscribeForTimes(
    eventName: string,
    timesCount: number,
    handler: EventHandler,
    order: HandlerOrder = 'append',
  ): EventUnsubscriber<this> {
    if (timesCount <= 0) {
      throw new RangeError('Handler call times counter must be greater than 0');
    }

    let handlerCallsCount = 0;
    let unsubscriber: EventUnsubscriber<this>;
    const wrappedHandler = (payload: unknown) => {
      handler(payload);
      handlerCallsCount += 1;
      if (handlerCallsCount >= timesCount) {
        unsubscriber.off();
      }
    };

    unsubscriber =
      order === 'append'
        ? this.addListener(eventName, wrappedHandler)
        : this.prependListener(eventName, wrappedHandler);
    return unsubscriber;
  }

  getMaxListeners(): number {
    return this.#eventHandlersProvider.getMaxListeners();
  }

  setMaxListeners(maxListeners: number): void {
    this.#eventHandlersProvider.setMaxListeners(maxListeners);
  }

  on(eventName: string, handler: EventHandler): EventUnsubscriber<this> {
    this.#eventHandlersProvider.addEventHandler(eventName, handler);
    return this.#createEventUnsubscriber(eventName, handler);
  }

  addListener(eventName: string, handler: EventHandler): EventUnsubscriber<this> {
    return this.on(eventName, handler);
  }

  prependListener(eventName: string, handler: EventHandler): EventUnsubscriber<this> {
    this.#eventHandlersProvider.addEventHandler(eventName, handler, 'prepend');
    return this.#createEventUnsubscriber(eventName, handler);
  }

  off(eventName: string, handler: EventHandler): void {
    this.#eventHandlersProvider.removeEventHandler(eventName, handler);
  }

  removeListener(eventName: string, handler: EventHandler): void {
    this.off(eventName, handler);
  }

  offEvent(eventName: string): boolean {
    return this.#eventHandlersProvider.removeAllEventHandlers(eventName);
  }

  any(handler: EventHandler) {
    this.#eventHandlersProvider.addAnyEventHandler(handler);
  }

  prependAny(handler: EventHandler) {
    this.#eventHandlersProvider.addAnyEventHandler(handler, 'prepend');
  }

  offAny(handler: EventHandler) {
    this.#eventHandlersProvider.removeAnyEventHandler(handler);
  }

  times(eventName: string, timesCount: number, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, timesCount, handler);
  }

  prependTimes(eventName: string, timesCount: number, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, timesCount, handler, 'prepend');
  }

  once(eventName: string, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, 1, handler);
  }

  prependOnce(eventName: string, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, 1, handler, 'prepend');
  }

  all(events: string[], handler: EventHandler): EventUnsubscriber<this> {
    this.#eventHandlersProvider.addRelatedEventsHandler(events, handler);
    return this.#createEventUnsubscriber(events, handler);
  }

  await(eventName: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.on(eventName, (payload: unknown) => {
        if (payload instanceof Error) {
          reject(payload);
        } else {
          resolve(payload);
        }
      });
    });
  }

  handlers(eventName: string): EventHandler[] {
    const eventHandlersGenerator = this.#eventHandlersProvider.getEventHandlers(eventName);
    return Array.from(eventHandlersGenerator);
  }

  handlersAny(): EventHandler[] {
    const anyEventsHandlersGenerator = this.#eventHandlersProvider.getAnyEventsHandlers();
    return Array.from(anyEventsHandlersGenerator);
  }

  eventNames(): string[] {
    const eventNamesGenerator = this.#eventHandlersProvider.getEventsNames();
    return Array.from(eventNamesGenerator);
  }

  emit(eventName: string, payload: unknown): void {
    const anyEventsHandlersGenerator = this.#eventHandlersProvider.getAnyEventsHandlers();

    const eventHandlersGenerator = this.#eventHandlersProvider.getEventHandlers(eventName);

    for (const cb of eventHandlersGenerator) {
      cb(payload);
    }

    for (const cb of anyEventsHandlersGenerator) {
      cb(payload);
    }

    this.#eventHandlersProvider.handleRelatedEvents(eventName, payload);
  }
}
