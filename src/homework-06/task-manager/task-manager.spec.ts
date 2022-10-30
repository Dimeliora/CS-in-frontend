/* eslint-disable no-console */
import TaskManager from './task-manager';

describe('Task manager implementation', () => {
  it('Task manager must iterate huge iterables with no I/O blocking', () => {
    const taskManager = new TaskManager();
    const nums = [...Array(5e5).keys()];
    let sumOfNums = 0;

    expect(
      taskManager
        .forEach(nums, (num) => {
          sumOfNums += num;
        })
        .then(() => {
          expect(sumOfNums === 5e5);
        }),
    );
  });

  it('Task manager must handle callback application errors', () => {
    const taskManager = new TaskManager();
    const nums = [1, 2, 3, '4', 5, 6, 7];

    expect(
      taskManager
        .forEach(nums, (num) => {
          // @ts-ignore
          num.toFixed();
        })
        .catch((err) => {
          expect(err).toBeInstanceOf(TypeError);
        }),
    );
  });

  it('Attemtp to work with non-iterable object', () => {
    const taskManager = new TaskManager();
    const nums = 1234567;

    expect(() =>
      taskManager
        // @ts-ignore
        .forEach(nums, (num) => {
          console.log(num);
        }),
    ).toThrowError('Object is not iterable');
  });

  it('Attemtp to work with no callback provided', () => {
    const taskManager = new TaskManager();
    const nums = [...Array(5e5).keys()];

    // @ts-ignore
    expect(() => taskManager.forEach(nums)).toThrowError('Callback is not a type of function');
  });

  it('Task manager must iterate iterables within task priorities order', () => {
    const taskManager = new TaskManager();
    const nums = [...Array(1e4).keys()];
    let lowPriorityTaskResult = 0;
    let averagePriorityTaskResult = 0;
    let highPriorityTaskResult = 0;
    let criticalPriorityTaskResult = 0;
    const resultsQueue: number[] = [];

    const lowPriorityTask = taskManager;
    // Initial dummy task added for clean testing result
    // The very first task starts iteration tick and gets all the pool time, while next tasks will be added later
    taskManager.forEach(Array(10), () => {});

    taskManager
      .forEach(
        nums,
        () => {
          lowPriorityTaskResult += 1;
        },
        { priority: 'low' },
      )
      .then(() => {
        resultsQueue.push(lowPriorityTaskResult);
      });

    const averagePriorityTask = taskManager
      .forEach(nums, () => {
        averagePriorityTaskResult += 2;
      })
      .then(() => {
        resultsQueue.push(averagePriorityTaskResult);
      });

    const highPriorityTask = taskManager
      .forEach(
        nums,
        () => {
          highPriorityTaskResult += 3;
        },
        { priority: 'high' },
      )
      .then(() => {
        resultsQueue.push(highPriorityTaskResult);
      });

    const criticalPriorityTask = taskManager
      .forEach(
        nums,
        () => {
          criticalPriorityTaskResult += 4;
        },
        { priority: 'critical' },
      )
      .then(() => {
        resultsQueue.push(criticalPriorityTaskResult);
      });

    Promise.all([lowPriorityTask, averagePriorityTask, highPriorityTask, criticalPriorityTask]).then(() => {
      expect(resultsQueue).toEqual([4e4, 3e4, 2e4, 1e4]);
    });
  });
});
