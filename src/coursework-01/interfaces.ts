export interface EventEmitterOptions {
  namespaces?: boolean;
  namespaceDelimiter?: string;
  maxListeners?: number;
  relatedEventsTimeout?: number;
  anyEventsFirst?: boolean;
}

export interface EventHandlersProviderOptions {
  namespaces?: boolean;
  namespaceDelimiter?: string;
  maxListeners?: number;
  relatedEventsTimeout?: number;
}

export type EventHandler = (payload: unknown) => void;

export type HandlerOrder = 'append' | 'prepend';

export interface EventHandlersProvider {
  addEventHandler(eventName: string, handler: EventHandler, order?: HandlerOrder): void;
  removeEventHandler(eventName: string, handler: EventHandler): void;
  removeAllEventHandlers(eventName: string): boolean;

  addAnyEventHandler(handler: EventHandler, order?: HandlerOrder): void;
  removeAnyEventHandler(handler: EventHandler): void;

  addRelatedEventsHandler(events: string[], handler: EventHandler): void;
  removeRelatedEventsHandler(events: string[]): void;

  getEventHandlers(eventName: string, delimiter?: string): Generator<EventHandler, void, undefined>;
  getAnyEventsHandlers(): Generator<EventHandler, void, undefined>;
  getEventsNames(): Generator<string, void, undefined>;
  handleRelatedEvents(eventName: string, payload: unknown): void;

  getMaxListeners(): number;
  setMaxListeners(max: number): void;
}

export interface EventUnsubscriber<T> {
  eventEmitter: T;
  event: string | string[];
  handler: EventHandler;
  off: () => void;
}

export interface RelatedEvents {
  handler: (...payloads: unknown[]) => void;
  eventsData: Record<string, RelatedEventData>;
}

export interface RelatedEventData {
  payload: unknown;
  firedTimestamp: number;
}
