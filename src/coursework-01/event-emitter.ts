import EventNamespacesMap from './event-handlers-providers/event-namespaces-map.js';
import EventMap from './event-handlers-providers/event-map.js';
import type {
  EventHandlersProvider,
  EventEmitterOptions,
  EventHandler,
  EventName,
  EventUnsubscriber,
  HandlerOrder,
} from './interfaces.js';

export default class EventEmitter {
  #eventHandlersProvider: EventHandlersProvider;

  #namespaces: boolean;

  #namespaceDelimiter: string;

  constructor({ namespaces = false, namespaceDelimiter = '.' }: EventEmitterOptions = {}) {
    this.#namespaceDelimiter = namespaceDelimiter;
    this.#namespaces = namespaces;

    this.#eventHandlersProvider = this.#namespaces ? new EventNamespacesMap() : new EventMap();
  }

  #stringifyEventName(eventName: EventName): string {
    return Array.isArray(eventName) ? eventName.join(this.#namespaceDelimiter) : eventName;
  }

  #createEventUnsubscriber(event: string, handler: EventHandler): EventUnsubscriber<this> {
    return {
      eventEmitter: this,
      event,
      handler,
      off: () => {
        this.#eventHandlersProvider.removeHandler(event, handler);
      },
    };
  }

  #subscribeForTimes(
    eventName: EventName,
    timesCount: number,
    handler: EventHandler,
    order: HandlerOrder = 'append',
  ): EventUnsubscriber<this> {
    if (timesCount <= 0) {
      throw new RangeError('Handler call times counter must be greater than 0');
    }

    let handlerCallsCount = 0;
    let unsubscriber: EventUnsubscriber<this>;
    const wrappedHandler = (...payload: unknown[]) => {
      handler(...payload);
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

  setMaxListeners(maxListeners: number): void {
    this.#eventHandlersProvider.setMaxListeners(maxListeners);
  }

  on(eventName: EventName, handler: EventHandler): EventUnsubscriber<this> {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    this.#eventHandlersProvider.addHandler(stringifiedEventName, handler);
    return this.#createEventUnsubscriber(stringifiedEventName, handler);
  }

  addListener(eventName: EventName, handler: EventHandler): EventUnsubscriber<this> {
    return this.on(eventName, handler);
  }

  prependListener(eventName: EventName, handler: EventHandler): EventUnsubscriber<this> {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    this.#eventHandlersProvider.addHandler(stringifiedEventName, handler, 'prepend');
    return this.#createEventUnsubscriber(stringifiedEventName, handler);
  }

  off(eventName: EventName, handler: EventHandler): void {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    this.#eventHandlersProvider.removeHandler(stringifiedEventName, handler);
  }

  removeListener(eventName: EventName, handler: EventHandler): void {
    this.off(eventName, handler);
  }

  any(handler: EventHandler) {
    this.#eventHandlersProvider.addAnyHandler(handler);
  }

  prependAny(handler: EventHandler) {
    this.#eventHandlersProvider.addAnyHandler(handler, 'prepend');
  }

  offAny(handler: EventHandler) {
    this.#eventHandlersProvider.removeAnyHandler(handler);
  }

  times(eventName: EventName, timesCount: number, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, timesCount, handler);
  }

  prependTimes(eventName: EventName, timesCount: number, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, timesCount, handler, 'prepend');
  }

  once(eventName: EventName, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, 1, handler);
  }

  prependOnce(eventName: EventName, handler: EventHandler) {
    return this.#subscribeForTimes(eventName, 1, handler, 'prepend');
  }

  offEvent(eventName: EventName): boolean {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    return this.#eventHandlersProvider.removeAllEventHandlers(stringifiedEventName);
  }

  listeners(eventName: EventName): EventHandler[] {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    return this.#eventHandlersProvider.getEventListeners(stringifiedEventName);
  }

  listenersAny(): EventHandler[] {
    return this.#eventHandlersProvider.anyHandlers;
  }

  eventNames(): string[] {
    return this.#eventHandlersProvider.eventNames;
  }

  emit(eventName: string, ...payload: unknown[]): void {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    const handlers = this.#eventHandlersProvider.getHandlers(stringifiedEventName, this.#namespaceDelimiter);

    for (const cb of handlers) {
      cb(...payload);
    }
  }
}
