import Queue from './queue';

describe('Queue implementation', () => {
  it('Insertion value into queue', () => {
    const queue = new Queue<number>();

    queue.enqueue(0);
    expect(queue.peek()).toBe(0);
    queue.enqueue(1);
    expect(queue.peek()).toBe(0);
    expect(queue.isEmpty).toBe(false);
  });

  it('Removing value from queue', () => {
    const queue = new Queue<number>();

    queue.enqueue(0);
    queue.enqueue(1);
    expect(queue.dequeue()).toBe(0);
    expect(queue.peek()).toBe(1);
    expect(queue.dequeue()).toBe(1);
    expect(queue.peek()).toBeNull();
    expect(queue.isEmpty).toBe(true);
  });

  it('Removing value from an empty queue', () => {
    const queue = new Queue<number>();

    expect(() => queue.dequeue()).toThrowError('Queue is empty');
  });
});
