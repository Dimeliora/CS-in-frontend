import forEach from './for-each';

describe('Implementation of forEach function', () => {
  it('forEach must iterate huge iterables with no I/O blocking', () => {
    const nums = [...Array(5e5).keys()];
    let sumOfNums = 0;

    expect(
      forEach(nums, (num) => {
        sumOfNums += num;
      }).then(() => {
        expect(sumOfNums === 5e5);
      }),
    );
  });

  it('forEach must handle callback application errors', () => {
    const nums = [1, 2, 3, '4', 5, 6, 7];

    expect(
      forEach(nums, (num) => {
        // @ts-ignore
        num.toFixed();
      }).catch((err) => {
        expect(err).toBeInstanceOf(TypeError);
      }),
    );
  });
});
