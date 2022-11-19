export type EventHandler = (...args: unknown[]) => void;

export interface EventEmitterOptions {
  namespaces?: boolean;
  namespaceDelimiter?: string;
}

export interface EventHandlersProvider {
  addHandler(eventName: string, handler: EventHandler): void;
  prependHandler(eventName: string, handler: EventHandler): void;
  removeHandler(eventName: string, handler: EventHandler): void;
  addAnyHandler(handler: EventHandler): void;
  prependAnyHandler(handler: EventHandler): void;
  removeAnyHandler(handler: EventHandler): void;
  getHandlers(eventName: string, delimiter?: string): Generator<EventHandler>;
}

export interface EventUnsubscriber<T> {
  eventEmitter: T;
  event: string;
  handler: EventHandler;
  off: () => void;
}
