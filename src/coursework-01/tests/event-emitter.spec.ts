import EventEmitter from '../event-emitter/event-emitter';
import take from '../async-iterator-helpers/async-itertator-functions/take';
import map from '../async-iterator-helpers/async-itertator-functions/map';
import filter from '../async-iterator-helpers/async-itertator-functions/filter';

describe('Implementation of Event Emitter (EE)', () => {
  it('Subscription on event, emitting event with payload data, event unsubscription', () => {
    const ee = new EventEmitter();
    const results: number[] = [];

    const event = ee.on('foo', (value: number) => {
      results.push(value);
    });

    for (const num of [1, 2, 3, 4, 5, 6, 7, 8]) {
      ee.emit('foo', num);

      if (num === 5) event.off();
    }

    ee.emit('foo', 42);

    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  it('Multiple subscriptions on event, prepending event handler', () => {
    const ee = new EventEmitter();
    const results: number[] = [];

    ee.on('foo', () => {
      results.push(1);
    });

    ee.addListener('foo', () => {
      results.push(2);
    });

    ee.prependListener('foo', () => {
      results.push(3);
    });

    ee.emit('foo', null);
    ee.removeEvent('foo');

    expect(results).toEqual([3, 1, 2]);
  });

  it('Event unsubscription with method off', () => {
    const ee = new EventEmitter();
    const results: number[] = [];
    const eventName = 'foo';
    const cb = (value: number) => {
      results.push(value);
    };

    ee.on(eventName, cb);

    for (const num of [1, 2, 3, 4, 5, 6, 7, 8]) {
      ee.emit('foo', num);

      if (num === 3) ee.off(eventName, cb);
    }

    ee.emit('foo', 42);

    expect(results).toEqual([1, 2, 3]);
  });

  it('Handling any event with unsubscription', () => {
    const ee = new EventEmitter();
    const results: number[] = [];
    const cb = (value: number) => {
      results.push(value);
    };

    ee.any(cb);

    for (const num of [1, 2, 3, 4, 5]) {
      ee.emit('foo', num);
      ee.emit('bar', num * 2);

      if (num === 3) ee.removeAny(cb);
    }

    ee.emit('foo', 42);
    ee.emit('bar', 42);

    expect(results).toEqual([1, 2, 2, 4, 3, 6]);
  });

  it('Subscription on event with TTL', () => {
    const ee = new EventEmitter();
    const onceResults: number[] = [];
    const timesResults: number[] = [];

    const onceEvent = ee.once('foo', (value: number) => {
      onceResults.push(value);
    });

    const timesEvent = ee.times('foo', 3, (value: number) => {
      timesResults.push(value);
    });

    for (const num of [1, 2, 3, 4, 5, 6, 7]) {
      ee.emit('foo', num);
    }

    onceEvent.off();
    timesEvent.off();
    ee.emit('foo', 42);

    expect(onceResults).toEqual([1]);
    expect(timesResults).toEqual([1, 2, 3]);
  });

  it('Subscription on related events (must be fired all off provided events to call a cb), unsubscription', () => {
    const ee = new EventEmitter();
    const results: number[] = [];

    const event = ee.allOf(['foo', 'bar'], (a: number, b: number) => {
      results.push(a, b);
    });

    ee.emit('foo', 1);
    expect(results).toEqual([]);

    ee.emit('bar', 2);
    expect(results).toEqual([1, 2]);

    event.off();
    ee.emit('foo', 1);
    ee.emit('bar', 2);
    expect(results).toEqual([1, 2]);
  });

  it('Subscription on event with Promise API', (done) => {
    const ee = new EventEmitter();

    ee.await('foo').then((value: number) => {
      try {
        expect(value).toBe(42);
        done();
      } catch (testError) {
        done(testError);
      }
    });

    ee.emit('foo', 42);
  });

  it('Getting registered event names, handlers', () => {
    const ee = new EventEmitter();
    const cbFooOn = () => {};
    const cbFooOnce = () => {};
    const cbBarTimes = () => {};
    const cbAny = () => {};

    ee.on('foo', cbFooOn);
    ee.once('foo', cbFooOnce);
    ee.times('bar', 2, cbBarTimes);
    ee.any(cbAny);

    expect(ee.handlers('foo').every((cb) => typeof cb === 'function')).toBe(true);
    expect(ee.handlers('foo').length).toBe(2);

    expect(ee.handlers('bar').every((cb) => typeof cb === 'function')).toBe(true);
    expect(ee.handlers('bar').length).toBe(1);

    expect(ee.handlersAny().every((cb) => typeof cb === 'function')).toBe(true);
    expect(ee.handlersAny().length).toBe(1);

    expect(ee.eventNames()).toEqual(['foo', 'bar']);
  });

  it('Event subscription stream with async iterator API', async () => {
    const ee = new EventEmitter();
    const results: number[] = [];
    let counter = 0;

    const id = setInterval(() => {
      counter += 1;

      ee.emit('foo', counter);

      if (counter > 5) ee.removeStream('foo');
      if (counter === 10) clearInterval(id);
    });

    for await (const value of ee.stream('foo')) {
      results.push(value as number);
    }

    expect(results).toEqual([1, 2, 3, 4, 5]);
  });

  it('Event stream working with async iterator helpers composition', async () => {
    const ee = new EventEmitter();
    const results: string[] = [];
    let counter = 0;

    const id = setInterval(() => {
      counter += 1;

      ee.emit('foo', counter);

      if (counter === 20) {
        ee.removeStream('foo');
        clearInterval(id);
      }
    });

    const iterComposition = take(
      map(
        filter(ee.stream('foo'), (value: number) => value % 2 === 0),
        (value: number) => value.toString(),
      ),
      5,
    );

    for await (const value of iterComposition) {
      results.push(value as string);
    }

    expect(results).toEqual(['2', '4', '6', '8', '10']);
  });

  it('Working with event namespaces (strings with delimiters and wildcards)', () => {
    const ee = new EventEmitter({ namespaces: true });
    const results: number[] = [];

    ee.on('foo.*', (value: number) => {
      results.push(value);
    });

    for (const num of [1, 2, 3]) {
      ee.emit('foo.bar', num);
      ee.emit('foo.bla', num * 2);
    }

    expect(results).toEqual([1, 2, 2, 4, 3, 6]);
  });
});
