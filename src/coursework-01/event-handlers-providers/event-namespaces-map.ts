import AbstractEventHandlersProvider from './event-handlers-provider.js';
import wildcardMatcher from '../helpers/wildcard-matcher.js';
import type { EventHandler } from '../interfaces.js';

export default class EventNamespacesMap extends AbstractEventHandlersProvider {
  getHandlers(eventName: string, delimiter: string): Generator<EventHandler> {
    const { anyEventHandlers } = this;
    const eventHandlersMapIterator = this.eventHandlersMap.entries();

    function* generate() {
      for (const [event, handlers] of eventHandlersMapIterator) {
        if (wildcardMatcher(eventName, event, delimiter)) {
          yield* handlers;
        }
      }

      yield* anyEventHandlers;
    }

    return generate();
  }
}
