export interface EventEmitterOptions {
  namespaces?: boolean;
  namespaceDelimiter?: string;
  anyEventsFirst?: boolean;
}

export type EventHandler = (payload: unknown) => void;

export type EventName = string | string[];

export type HandlerOrder = 'append' | 'prepend';

export interface EventHandlersProvider {
  addHandler(eventName: string, handler: EventHandler, order?: HandlerOrder): void;
  removeHandler(eventName: string, handler: EventHandler): void;
  addAnyHandler(handler: EventHandler, order?: HandlerOrder): void;
  removeAnyHandler(handler: EventHandler): void;
  removeAllEventHandlers(eventName: string): boolean;
  getEventHandlers(eventName: string, delimiter?: string): Generator<EventHandler, void, undefined>;
  getAnyEventsHandlers(): Generator<EventHandler, void, undefined>;
  getEventsNames(): Generator<string, void, undefined>;
  setMaxListeners(max: number): void;
}

export interface EventUnsubscriber<T> {
  eventEmitter: T;
  event: string;
  handler: EventHandler;
  off: () => void;
}
