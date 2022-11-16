import AbstractEventHandlersProvider from './abstarct-event-handlers-provider';
import wildcardMatcher from '../helpers/wildcard-matcher';
import type { EventHandler } from '../interfaces';

export default class EventNamespacesMap extends AbstractEventHandlersProvider {
  eventsMap: Map<string, EventHandler[]> = new Map();

  getHandlers(eventName: string, delimiter: string): Generator<EventHandler> {
    const eventsMapIterator = this.eventsMap.entries();

    function* generate() {
      for (const [event, handlers] of eventsMapIterator) {
        if (wildcardMatcher(eventName, event, delimiter)) {
          yield* handlers;
        }
      }
    }

    return generate();
  }
}
