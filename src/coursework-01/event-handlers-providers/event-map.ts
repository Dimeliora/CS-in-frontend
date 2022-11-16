import AbstractEventHandlersProvider from './abstarct-event-handlers-provider';
import type { EventHandler } from '../interfaces';

export default class EventMap extends AbstractEventHandlersProvider {
  eventsMap = new Map<string, EventHandler[]>();

  getHandlers(eventName: string): Generator<EventHandler> {
    const handlers = this.eventsMap.get(eventName) ?? [];

    function* generate() {
      for (const handler of handlers) {
        yield handler;
      }
    }

    return generate();
  }
}
