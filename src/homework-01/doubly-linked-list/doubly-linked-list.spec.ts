import DoublyLinkedListImpl from './doubly-linked-list';

describe('Doubly linked list implementation', () => {
  it('Attempt to construct list from iterable', () => {
    const list = new DoublyLinkedListImpl<string>('foobar');

    expect(list.head?.value).toBe('f');
    expect(list.tail?.value).toBe('r');
  });

  it('Attempt to construct list from non iterable', () => {
    // @ts-ignore
    expect(() => new DoublyLinkedListImpl<any>(123)).toThrowError('Object is not iterable');
  });

  it('Check if list is empty', () => {
    const list = new DoublyLinkedListImpl<number>();

    expect(list.isEmpty()).toBe(true);

    list.push(0);

    expect(list.isEmpty()).toBe(false);
  });

  it('Pushing value into empty list', () => {
    const list = new DoublyLinkedListImpl<number>();
    list.push(0);

    expect(list.head?.value).toBe(0);
    expect(list.tail?.value).toBe(0);
    expect(list.size).toBe(1);
  });

  it('Pushing value into list with items', () => {
    const list = new DoublyLinkedListImpl<number>([0]);
    list.push(1);

    expect(list.head?.next?.value).toBe(1);
    expect(list.tail?.value).toBe(1);
    expect(list.tail?.prev?.value).toBe(0);
    expect(list.size).toBe(2);
  });

  it('Popping value from list with items', () => {
    const list = new DoublyLinkedListImpl<number>([0, 1]);
    const poppedNode = list.pop();

    expect(poppedNode?.value).toBe(1);
    expect(list.tail?.value).toBe(0);
    expect(list.tail?.next).toBeNull();
    expect(list.size).toBe(1);
  });

  it('Popping last value from list', () => {
    const list = new DoublyLinkedListImpl<number>([0]);
    const poppedNode = list.pop();

    expect(poppedNode?.value).toBe(0);
    expect(list.tail).toBeNull();
    expect(list.head).toBeNull();
    expect(list.size).toBe(0);
  });

  it('Popping value from empty list', () => {
    const list = new DoublyLinkedListImpl<number>();

    expect(list.pop()).toBeNull();
  });

  it('Unshifting value into empty list', () => {
    const list = new DoublyLinkedListImpl<number>();
    list.unshift(0);

    expect(list.head?.value).toBe(0);
    expect(list.tail?.value).toBe(0);
    expect(list.size).toBe(1);
  });

  it('Unshifting value into list with items', () => {
    const list = new DoublyLinkedListImpl<number>([0]);
    list.unshift(1);

    expect(list.head?.value).toBe(1);
    expect(list.head?.next?.value).toBe(0);
    expect(list.tail?.prev?.value).toBe(1);
    expect(list.size).toBe(2);
  });

  it('Shifting value from list with items', () => {
    const list = new DoublyLinkedListImpl<number>([0, 1]);
    const shiftedNode = list.shift();

    expect(shiftedNode?.value).toBe(0);
    expect(list.head?.value).toBe(1);
    expect(list.tail?.value).toBe(1);
    expect(list.size).toBe(1);
  });

  it('Shifting last value from list', () => {
    const list = new DoublyLinkedListImpl<number>([0]);
    const shiftedNode = list.shift();

    expect(shiftedNode?.value).toBe(0);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
    expect(list.size).toBe(0);
  });

  it('Shifting value from empty list', () => {
    const list = new DoublyLinkedListImpl<number>();

    expect(list.shift()).toBeNull();
  });

  it('List instance must be iterable', () => {
    const list = new DoublyLinkedListImpl<number>([0, 1, 2]);

    expect([...list]).toEqual([0, 1, 2]);
  });

  it('Reversing list', () => {
    const list = new DoublyLinkedListImpl<number>([0, 1, 2]);
    list.reverse();

    expect([...list]).toEqual([2, 1, 0]);
  });
});
