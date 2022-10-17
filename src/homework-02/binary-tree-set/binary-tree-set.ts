import BinaryTreeSetNode from './binary-tree-set-node';
import { Queue } from '../../homework-01';
import type { Nullable, Optional } from '../../utils/common.types';
import type { IterableBinaryTree } from './binary-tree-set.interface';

export default class BinaryTreeSet<T> implements Iterable<T>, IterableBinaryTree<T> {
  #root: Nullable<BinaryTreeSetNode<T>> = null;

  static #getIterator<T>(iterable?: Iterator<T>): IterableIterator<T> {
    return {
      [Symbol.iterator](): IterableIterator<T> {
        return this;
      },
      next(): IteratorResult<T, Optional<T>> {
        if (iterable) {
          const { done, value } = iterable.next();
          if (done) return { done: true, value: undefined };

          return { done: false, value };
        }

        return { done: true, value: undefined };
      },
    };
  }

  constructor(iterable?: Iterable<T>) {
    if (iterable == null) return;

    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new TypeError('Object is not iterable');
    }

    for (const element of iterable) {
      this.add(element);
    }
  }

  add(newValue: T): this {
    if (this.#root === null) {
      this.#root = new BinaryTreeSetNode(newValue);
      return this;
    }

    let currentNode: Nullable<BinaryTreeSetNode<T>> = this.#root;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (newValue === currentNode.value) return this;

      const parentNode = currentNode;
      if (newValue < currentNode.value) {
        currentNode = currentNode.leftChild;
        if (currentNode === null) {
          parentNode.leftChild = new BinaryTreeSetNode(newValue);
          return this;
        }
      } else {
        currentNode = currentNode.rightChild;
        if (currentNode === null) {
          parentNode.rightChild = new BinaryTreeSetNode(newValue);
          return this;
        }
      }
    }
  }

  has(value: T): boolean {
    let currentNode = this.#root;

    while (currentNode) {
      if (currentNode.value === value) return true;

      currentNode = currentNode.value < value ? currentNode.rightChild : currentNode.leftChild;
    }

    return false;
  }

  getMin(): Nullable<T> {
    let currentNode = this.#root;

    while (currentNode?.leftChild) {
      currentNode = currentNode.leftChild;
    }

    return currentNode && currentNode.value;
  }

  getMax(): Nullable<T> {
    let currentNode = this.#root;

    while (currentNode?.rightChild) {
      currentNode = currentNode.rightChild;
    }

    return currentNode && currentNode.value;
  }

  inorder(): IterableIterator<T> {
    return BinaryTreeSet.#getIterator<T>(this.#root?.inorder());
  }

  preorder(): IterableIterator<T> {
    return BinaryTreeSet.#getIterator<T>(this.#root?.preorder());
  }

  postorder(): IterableIterator<T> {
    return BinaryTreeSet.#getIterator<T>(this.#root?.postorder());
  }

  breadsFirst(): IterableIterator<T> {
    const queue = new Queue<Nullable<BinaryTreeSetNode<T>>>();
    queue.enqueue(this.#root);

    return {
      [Symbol.iterator](): IterableIterator<T> {
        return this;
      },
      next(): IteratorResult<T, Optional<T>> {
        const currentNode = queue.dequeue();
        if (!currentNode) return { done: true, value: undefined };

        if (currentNode.leftChild) queue.enqueue(currentNode.leftChild);
        if (currentNode.rightChild) queue.enqueue(currentNode.rightChild);
        return { done: false, value: currentNode.value };
      },
    };
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.inorder();
  }
}
