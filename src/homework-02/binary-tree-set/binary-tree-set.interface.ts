export interface IterableBinaryTree<T> {
  inorder(): IterableIterator<T>;
  preorder(): IterableIterator<T>;
  postorder(): IterableIterator<T>;
}
