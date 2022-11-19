import type { EventHandlersProvider, EventHandler } from '../interfaces.js';

export default abstract class AbstractEventHandlersProvider implements EventHandlersProvider {
  eventHandlersMap = new Map<string, EventHandler[]>();

  anyEventHandlers: EventHandler[] = [];

  checkoutEventHandlersArray(eventName: string): EventHandler[] {
    if (!this.eventHandlersMap.has(eventName)) {
      this.eventHandlersMap.set(eventName, []);
    }

    return this.eventHandlersMap.get(eventName)!;
  }

  addHandler(eventName: string, handler: EventHandler): void {
    const eventHandlers = this.checkoutEventHandlersArray(eventName);
    eventHandlers!.push(handler);
  }

  prependHandler(eventName: string, handler: EventHandler): void {
    const eventHandlers = this.checkoutEventHandlersArray(eventName);
    eventHandlers!.unshift(handler);
  }

  removeHandler(eventName: string, handler: EventHandler): void {
    const eventHandlers = this.eventHandlersMap.get(eventName);
    if (!eventHandlers) return;

    const cleanedUpEventHandlers = eventHandlers.filter((cb) => cb !== handler);
    if (cleanedUpEventHandlers.length > 0) {
      this.eventHandlersMap.set(eventName, cleanedUpEventHandlers);
    } else {
      this.eventHandlersMap.delete(eventName);
    }
  }

  addAnyHandler(handler: EventHandler): void {
    this.anyEventHandlers.push(handler);
  }

  prependAnyHandler(handler: EventHandler): void {
    this.anyEventHandlers.unshift(handler);
  }

  removeAnyHandler(handler: EventHandler): void {
    this.anyEventHandlers = this.anyEventHandlers.filter((cb) => cb !== handler);
  }

  abstract getHandlers(eventName: string, delimiter?: string): Generator<EventHandler>;
}
