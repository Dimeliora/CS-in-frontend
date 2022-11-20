export interface EventEmitterOptions {
  namespaces?: boolean;
  namespaceDelimiter?: string;
}

export type EventHandler = (...args: unknown[]) => void;

export type EventName = string | string[];

export type HandlerOrder = 'append' | 'prepend';

export interface EventHandlersProvider {
  get anyHandlers(): EventHandler[];
  get eventNames(): string[];
  addHandler(eventName: string, handler: EventHandler, order?: HandlerOrder): void;
  removeHandler(eventName: string, handler: EventHandler): void;
  addAnyHandler(handler: EventHandler, order?: HandlerOrder): void;
  removeAnyHandler(handler: EventHandler): void;
  removeAllEventHandlers(eventName: string): boolean;
  getHandlers(eventName: string, delimiter?: string): Generator<EventHandler>;
  getEventListeners(eventName: string): EventHandler[];
  setMaxListeners(max: number): void;
}

export interface EventUnsubscriber<T> {
  eventEmitter: T;
  event: string;
  handler: EventHandler;
  off: () => void;
}
