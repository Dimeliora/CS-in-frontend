import AbstractEventHandlersProvider from './event-handlers-provider.js';
import type { EventHandler } from '../interfaces.js';

export default class EventMap extends AbstractEventHandlersProvider {
  *getEventHandlers(eventName: string): Generator<EventHandler, void, undefined> {
    const eventHandlers = this.eventHandlersMap.get(eventName) ?? [];

    yield* eventHandlers;
  }
}
