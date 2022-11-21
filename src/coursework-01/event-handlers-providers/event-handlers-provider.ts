/* eslint-disable no-console */
import type { EventHandlersProvider, EventHandler, HandlerOrder } from '../interfaces.js';

export default abstract class AbstractEventHandlersProvider implements EventHandlersProvider {
  eventHandlersMap = new Map<string, EventHandler[]>();

  anyEventHandlers: EventHandler[] = [];

  maxListeners: number = 0;

  checkoutEventHandlersArray(eventName: string): EventHandler[] {
    if (!this.eventHandlersMap.has(eventName)) {
      this.eventHandlersMap.set(eventName, []);
    }

    return this.eventHandlersMap.get(eventName)!;
  }

  checkEventListenersAmount(eventName?: string): void {
    const handlers = eventName == null ? this.anyEventHandlers : this.eventHandlersMap.get(eventName) ?? [];
    const event = eventName ?? 'any';
    if (this.maxListeners !== 0 && handlers.length > this.maxListeners) {
      console.warn(
        `Possible EventEmitter memory leak detected for ${event} event. Use emitter.setMaxListeners() to increase limit`,
      );
    }
  }

  setMaxListeners(maxListeners: number) {
    if (maxListeners < 0) {
      throw new RangeError('Amount of listeners must be greater or equal 0');
    }

    this.maxListeners = maxListeners;
  }

  addHandler(eventName: string, handler: EventHandler, order: HandlerOrder = 'append'): void {
    const eventHandlers = this.checkoutEventHandlersArray(eventName);
    if (order === 'append') {
      eventHandlers!.push(handler);
    } else {
      eventHandlers!.unshift(handler);
    }

    this.checkEventListenersAmount(eventName);
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

    this.checkEventListenersAmount();
  }

  removeAnyHandler(handler: EventHandler): void {
    this.anyEventHandlers = this.anyEventHandlers.filter((cb) => cb !== handler);
  }

  *getAnyEventsHandlers(): Generator<EventHandler, void, undefined> {
    yield* this.anyEventHandlers;
  }

  *getEventsNames(): Generator<string, void, undefined> {
    yield* this.eventHandlersMap.keys();
  }

  abstract getEventHandlers(eventName: string, delimiter?: string): Generator<EventHandler, void, undefined>;
}
