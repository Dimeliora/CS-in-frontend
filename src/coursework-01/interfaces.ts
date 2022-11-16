export type EventHandler = (...args: unknown[]) => void;

export interface EventEmitterOptions {
  namespaces?: boolean;
  namespaceDelimiter?: string;
}

export interface EventHandlersProvider {
  addHandler(eventName: string | string[], handler: EventHandler): void;
  prependHandler(eventName: string | string[], handler: EventHandler): void;
  getHandlers(eventName: string, delimiter?: string): Generator<EventHandler>;
}
