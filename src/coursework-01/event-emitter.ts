import EventNamespacesMap from './event-handlers-providers/event-namespaces-map.js';
import EventMap from './event-handlers-providers/event-map.js';
import type { EventHandlersProvider, EventEmitterOptions, EventHandler, EventUnsubscriber } from './interfaces';

export default class EventEmitter {
  #eventHandlersProvider: EventHandlersProvider;

  #namespaces: boolean;

  #namespaceDelimiter: string;

  constructor({ namespaces = false, namespaceDelimiter = '.' }: EventEmitterOptions = {}) {
    this.#namespaceDelimiter = namespaceDelimiter;
    this.#namespaces = namespaces;

    this.#eventHandlersProvider = this.#namespaces ? new EventNamespacesMap() : new EventMap();
  }

  #stringifyEventName(eventName: string | string[]): string {
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

  on(eventName: string | string[], handler: EventHandler): EventUnsubscriber<this> {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    this.#eventHandlersProvider.addHandler(stringifiedEventName, handler);

    return this.#createEventUnsubscriber(stringifiedEventName, handler);
  }

  addListener(eventName: string | string[], handler: EventHandler): EventUnsubscriber<this> {
    return this.on(eventName, handler);
  }

  prependListener(eventName: string | string[], handler: EventHandler): EventUnsubscriber<this> {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    this.#eventHandlersProvider.prependHandler(stringifiedEventName, handler);

    return this.#createEventUnsubscriber(stringifiedEventName, handler);
  }

  any(handler: EventHandler) {
    this.#eventHandlersProvider.addAnyHandler(handler);
  }

  prependAny(handler: EventHandler) {
    this.#eventHandlersProvider.prependAnyHandler(handler);
  }

  offAny(handler: EventHandler) {
    this.#eventHandlersProvider.removeAnyHandler(handler);
  }

  emit(eventName: string, payload: unknown): void {
    const stringifiedEventName = this.#stringifyEventName(eventName);
    const handlers = this.#eventHandlersProvider.getHandlers(stringifiedEventName, this.#namespaceDelimiter);

    for (const cb of handlers) {
      cb(payload);
    }
  }
}
