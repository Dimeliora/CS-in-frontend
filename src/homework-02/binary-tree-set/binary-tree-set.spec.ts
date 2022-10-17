import BinaryTreeSet from './binary-tree-set';

describe('Binary tree set (BTS) implementation', () => {
  it('Attempt to construct BTS from iterable', () => {
    const bts = new BinaryTreeSet<string>('foobar');

    expect(bts.has('f')).toBe(true);
    expect(bts.has('g')).toBe(false);
  });

  it('Attempt to construct BTS from noniterable', () => {
    // @ts-ignore
    expect(() => new BinaryTreeSet(123)).toThrowError('Object is not iterable');
  });

  it('Inserting values into BTS', () => {
    const bts = new BinaryTreeSet();

    bts.add(5);
    bts.add(2);
    expect(bts.has(5)).toBe(true);
    expect(bts.has(2)).toBe(true);
  });

  it('Getting min/max values from BTS', () => {
    const bts = new BinaryTreeSet([5, 2, 7, 4, 9]);

    expect(bts.getMin()).toBe(2);
    expect(bts.getMax()).toBe(9);
  });

  it('Traversing BTS by inorder method', () => {
    const bts = new BinaryTreeSet([5, 2, 7, 4, 9]);

    expect([...bts.inorder()]).toEqual([2, 4, 5, 7, 9]);
  });

  it('Traversing BTS by preorder method', () => {
    const bts = new BinaryTreeSet([5, 2, 7, 4, 9]);

    expect([...bts.preorder()]).toEqual([5, 2, 4, 7, 9]);
  });

  it('Traversing BTS by postorder method', () => {
    const bts = new BinaryTreeSet([5, 2, 7, 4, 9]);

    expect([...bts.postorder()]).toEqual([4, 2, 9, 7, 5]);
  });

  it('Traversing BTS by breadsfirst method', () => {
    const bts = new BinaryTreeSet([5, 2, 7, 4, 9]);

    expect([...bts.breadsFirst()]).toEqual([5, 2, 7, 4, 9]);
  });

  it('BTS must be iterable (by preorder)', () => {
    const bts = new BinaryTreeSet([5, 2, 7, 4, 9]);

    expect([...bts]).toEqual([2, 4, 5, 7, 9]);
  });
});
