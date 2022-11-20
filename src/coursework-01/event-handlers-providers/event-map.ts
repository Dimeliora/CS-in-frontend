import AbstractEventHandlersProvider from './event-handlers-provider.js';
import type { EventHandler } from '../interfaces.js';

export default class EventMap extends AbstractEventHandlersProvider {
  getHandlers(eventName: string): Generator<EventHandler> {
    const { anyEventHandlers } = this;
    const handlers = this.eventHandlersMap.get(eventName) ?? [];

    function* generate() {
      yield* handlers;
      yield* anyEventHandlers;
    }

    return generate();
  }
}
