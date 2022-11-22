/* eslint-disable no-console */
import wildcardMatcher from '../helpers/wildcard-matcher.js';
import type {
  EventHandlersProvider,
  EventHandler,
  EventHandlersProviderOptions,
  HandlerOrder,
  RelatedEvents,
  RelatedEventData,
} from '../interfaces.js';

export default class EventHandlersProviderImpl implements EventHandlersProvider {
  eventHandlersMap = new Map<string, EventHandler[]>();

  relatedEventsHandlersMap = new Map<string[], RelatedEvents>();

  anyEventHandlers: EventHandler[] = [];

  namespaces: boolean;

  namespaceDelimiter: string;

  maxListeners: number;

  relatedEventsTimeout: number;

  constructor({
    namespaces = false,
    namespaceDelimiter = '.',
    maxListeners = 0,
    relatedEventsTimeout = 0,
  }: EventHandlersProviderOptions = {}) {
    this.namespaces = namespaces;
    this.namespaceDelimiter = namespaceDelimiter;
    this.maxListeners = maxListeners;
    this.relatedEventsTimeout = relatedEventsTimeout;
  }

  checkoutEventHandlersArray(eventName: string): EventHandler[] {
    if (!this.eventHandlersMap.has(eventName)) {
      this.eventHandlersMap.set(eventName, []);
    }

    return this.eventHandlersMap.get(eventName)!;
  }

  checkEventListenersAmount(eventName?: string): void {
    const handlers = eventName == null ? this.anyEventHandlers : this.eventHandlersMap.get(eventName) ?? [];
    const event = eventName ?? 'any';
    if (this.maxListeners !== 0 && handlers.length > this.maxListeners) {
      console.warn(
        `Possible EventEmitter memory leak detected for ${event} event. Use emitter.setMaxListeners() to increase limit`,
      );
    }
  }

  isEventNameMatches(eventName: string, firedEvent: string): boolean {
    return this.namespaces ? wildcardMatcher(firedEvent, eventName, this.namespaceDelimiter) : eventName === firedEvent;
  }

  getMaxListeners(): number {
    return this.maxListeners;
  }

  setMaxListeners(maxListeners: number) {
    if (maxListeners < 0) {
      throw new RangeError('Amount of listeners must be greater or equal 0');
    }

    this.maxListeners = maxListeners;
  }

  addEventHandler(eventName: string, handler: EventHandler, order: HandlerOrder = 'append'): void {
    const eventHandlers = this.checkoutEventHandlersArray(eventName);
    if (order === 'append') {
      eventHandlers!.push(handler);
    } else {
      eventHandlers!.unshift(handler);
    }

    this.checkEventListenersAmount(eventName);
  }

  removeEventHandler(eventName: string, handler: EventHandler): void {
    const eventHandlers = this.eventHandlersMap.get(eventName);
    if (!eventHandlers) return;

    const cleanedUpEventHandlers = eventHandlers.filter((cb) => cb !== handler);
    if (cleanedUpEventHandlers.length > 0) {
      this.eventHandlersMap.set(eventName, cleanedUpEventHandlers);
    } else {
      this.eventHandlersMap.delete(eventName);
    }
  }

  removeAllEventHandlers(eventName: string): boolean {
    return this.eventHandlersMap.delete(eventName);
  }

  addAnyEventHandler(handler: EventHandler, order: HandlerOrder = 'append'): void {
    if (order === 'append') {
      this.anyEventHandlers.push(handler);
    } else {
      this.anyEventHandlers.unshift(handler);
    }

    this.checkEventListenersAmount();
  }

  removeAnyEventHandler(handler: EventHandler): void {
    this.anyEventHandlers = this.anyEventHandlers.filter((cb) => cb !== handler);
  }

  addRelatedEventsHandler(events: string[], handler: EventHandler): void {
    const relatedEvents: RelatedEvents = { handler, eventsData: Object.create(null) };
    this.relatedEventsHandlersMap.set(events, relatedEvents);
  }

  removeRelatedEventsHandler(events: string[]): void {
    this.relatedEventsHandlersMap.delete(events);
  }

  handleRelatedEvents(eventName: string, payload: unknown): void {
    const matchedOfRegisteredRelatedEvents = Array.from(this.relatedEventsHandlersMap.keys()).filter((relatedEvents) =>
      relatedEvents.some((eventItem) => this.isEventNameMatches(eventItem, eventName)),
    );

    for (const relatedEventsList of matchedOfRegisteredRelatedEvents) {
      const relatedEventsData = this.relatedEventsHandlersMap.get(relatedEventsList);

      if (relatedEventsData == null) return;

      const firedEventData: RelatedEventData = { payload, firedTimestamp: Date.now() };
      relatedEventsData.eventsData[eventName] = firedEventData;

      const eventData = Object.values(relatedEventsData.eventsData);
      const areAllRelatedEventsFired = eventData.length === relatedEventsList.length;
      const areEventPayloadsRecent =
        this.relatedEventsTimeout === 0 ||
        eventData.every(({ firedTimestamp }) => Date.now() - firedTimestamp < this.relatedEventsTimeout);

      if (areEventPayloadsRecent && areAllRelatedEventsFired) {
        const payloadsList = eventData.map((data) => data.payload);
        relatedEventsData.handler(...payloadsList);
        relatedEventsData.eventsData = Object.create(null);
      }
    }
  }

  *getAnyEventsHandlers(): Generator<EventHandler, void, undefined> {
    yield* this.anyEventHandlers;
  }

  *getEventsNames(): Generator<string, void, undefined> {
    yield* this.eventHandlersMap.keys();
  }

  *getEventHandlers(eventName: string): Generator<EventHandler, void, undefined> {
    if (this.namespaces) {
      const eventHandlersMapIterator = this.eventHandlersMap.entries();
      for (const [event, handlers] of eventHandlersMapIterator) {
        if (wildcardMatcher(eventName, event, this.namespaceDelimiter)) {
          yield* handlers;
        }
      }
    } else {
      const eventHandlers = this.eventHandlersMap.get(eventName) ?? [];
      yield* eventHandlers;
    }
  }
}
