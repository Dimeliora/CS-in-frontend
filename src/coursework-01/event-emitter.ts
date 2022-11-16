import EventNamespacesMap from './event-handlers-providers/event-namespaces-map';
import EventMap from './event-handlers-providers/event-map';
import type { EventHandlersProvider, EventEmitterOptions, EventHandler } from './interfaces';

export default class EventEmitter {
  #eventHandlersProvider: EventHandlersProvider;

  #namespaces: boolean;

  #namespaceDelimiter: string;

  constructor({ namespaces = false, namespaceDelimiter = '.' }: EventEmitterOptions = {}) {
    this.#namespaceDelimiter = namespaceDelimiter;
    this.#namespaces = namespaces;

    this.#eventHandlersProvider = this.#namespaces ? new EventNamespacesMap() : new EventMap();
  }

  #normalizeEventName(eventName: string | string[]): string {
    return Array.isArray(eventName) ? eventName.join(this.#namespaceDelimiter) : eventName;
  }

  on(eventName: string | string[], handler: EventHandler) {
    const eventTypeString = this.#normalizeEventName(eventName);
    this.#eventHandlersProvider.addHandler(eventTypeString, handler);
  }

  addListener(eventName: string | string[], handler: EventHandler) {
    return this.on(eventName, handler);
  }

  prependListener(eventName: string | string[], handler: EventHandler) {
    const eventTypeString = this.#normalizeEventName(eventName);
    this.#eventHandlersProvider.prependHandler(eventTypeString, handler);
  }

  emit(eventName: string, payload: unknown): void {
    const eventTypeString = this.#normalizeEventName(eventName);

    const handlers = this.#eventHandlersProvider.getHandlers(eventTypeString, this.#namespaceDelimiter);

    for (const cb of handlers) {
      cb(payload);
    }
  }
}
