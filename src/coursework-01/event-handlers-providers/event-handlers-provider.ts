import type { EventHandlersProvider, EventHandler, HandlerOrder } from '../interfaces.js';

export default abstract class AbstractEventHandlersProvider implements EventHandlersProvider {
  eventHandlersMap = new Map<string, EventHandler[]>();

  anyEventHandlers: EventHandler[] = [];

  get anyHandlers(): EventHandler[] {
    return this.anyEventHandlers;
  }

  get eventNames(): string[] {
    const keys = this.eventHandlersMap.keys();
    return Array.from(keys);
  }

  checkoutEventHandlersArray(eventName: string): EventHandler[] {
    if (!this.eventHandlersMap.has(eventName)) {
      this.eventHandlersMap.set(eventName, []);
    }

    return this.eventHandlersMap.get(eventName)!;
  }

  addHandler(eventName: string, handler: EventHandler, order: HandlerOrder = 'append'): void {
    const eventHandlers = this.checkoutEventHandlersArray(eventName);
    if (order === 'append') {
      eventHandlers!.push(handler);
    } else {
      eventHandlers!.unshift(handler);
    }
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

  removeAllEventHandlers(eventName: string): boolean {
    return this.eventHandlersMap.delete(eventName);
  }

  addAnyHandler(handler: EventHandler, order: HandlerOrder = 'append'): void {
    if (order === 'append') {
      this.anyEventHandlers.push(handler);
    } else {
      this.anyEventHandlers.unshift(handler);
    }
  }

  removeAnyHandler(handler: EventHandler): void {
    this.anyEventHandlers = this.anyEventHandlers.filter((cb) => cb !== handler);
  }

  getEventListeners(eventName: string): EventHandler[] {
    return this.eventHandlersMap.get(eventName) ?? [];
  }

  abstract getHandlers(eventName: string, delimiter?: string): Generator<EventHandler, any, unknown>;
}
