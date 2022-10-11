import Queue from './queue';

describe('Queue implementation', () => {
  it('Insertion value into queue', () => {
    const queue = new Queue<number>();

    queue.insert(0);
    expect(queue.peek()).toBe(0);
    queue.insert(1);
    expect(queue.peek()).toBe(0);
    expect(queue.isEmpty).toBe(false);
  });

  it('Removing value from queue', () => {
    const queue = new Queue<number>();

    queue.insert(0);
    queue.insert(1);
    expect(queue.remove()).toBe(0);
    expect(queue.peek()).toBe(1);
    expect(queue.remove()).toBe(1);
    expect(queue.peek()).toBeNull();
    expect(queue.isEmpty).toBe(true);
  });

  it('Removing value from an empty queue', () => {
    const queue = new Queue<number>();

    expect(() => queue.remove()).toThrowError('Queue is empty');
  });
});
