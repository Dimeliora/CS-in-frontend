import AbstractEventHandlersProvider from './event-handlers-provider.js';
import wildcardMatcher from '../helpers/wildcard-matcher.js';
import type { EventHandler } from '../interfaces.js';

export default class EventNamespacesMap extends AbstractEventHandlersProvider {
  *getEventHandlers(eventName: string, delimiter: string): Generator<EventHandler, void, undefined> {
    const eventHandlersMapIterator = this.eventHandlersMap.entries();

    for (const [event, handlers] of eventHandlersMapIterator) {
      if (wildcardMatcher(eventName, event, delimiter)) {
        yield* handlers;
      }
    }
  }
}
