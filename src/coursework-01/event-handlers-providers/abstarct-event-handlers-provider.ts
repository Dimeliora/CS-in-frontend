import type { EventHandlersProvider, EventHandler } from '../interfaces';

export default abstract class AbstractEventHandlersProvider implements EventHandlersProvider {
  abstract eventsMap: Map<string, EventHandler[]>;

  #checkoutEventHandlersArray(eventName: string): EventHandler[] {
    if (!this.eventsMap.has(eventName)) {
      this.eventsMap.set(eventName, []);
    }

    return this.eventsMap.get(eventName)!;
  }

  addHandler(eventName: string, handler: EventHandler): void {
    const handlers = this.#checkoutEventHandlersArray(eventName);
    handlers!.push(handler);
  }

  prependHandler(eventName: string, handler: EventHandler): void {
    const handlers = this.#checkoutEventHandlersArray(eventName);
    handlers!.unshift(handler);
  }

  abstract getHandlers(eventName: string, delimiter?: string): Generator<EventHandler>;
}
