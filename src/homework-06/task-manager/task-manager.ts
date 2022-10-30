import PriorityQueue from './priority-queue';
import { Task, TaskManagerOptions, Priority, TaskPriorityExecTimeRatio, ForEachOptions } from './task-manager.types';

export default class TaskManager {
  #poolExecTime: number = 100;

  #idleTime: number = 100;

  #averageTaskExecTime: number = this.#poolExecTime;

  #taskPool: Set<Task> = new Set();

  #taskQueue: PriorityQueue<Task> = new PriorityQueue();

  #isBusy: boolean = false;

  constructor({ poolExecTime, idleTime }: TaskManagerOptions = {}) {
    if (poolExecTime != null) this.#poolExecTime = poolExecTime;
    if (idleTime != null) this.#idleTime = idleTime;
  }

  *#createWorker<T>(
    iterable: Iterable<T>,
    callback: (iterElement: T) => void,
    priority: Priority,
  ): Generator<'timeout' | Error> {
    let startTime = performance.now();

    for (const value of iterable) {
      if (performance.now() - startTime > this.#averageTaskExecTime * TaskPriorityExecTimeRatio[priority]) {
        yield 'timeout';
        startTime = performance.now();
      }

      try {
        callback(value);
      } catch (error) {
        if (error instanceof Error) yield error;
      }
    }
  }

  #setupTaskQueueAndAverageExecTime(): void {
    let overallTaskExecTimeRatios = 0;
    for (const task of this.#taskPool.values()) {
      overallTaskExecTimeRatios += TaskPriorityExecTimeRatio[task.priority];

      this.#taskQueue.insert(
        task,
        (taskOfPool) => TaskPriorityExecTimeRatio[taskOfPool.priority] < TaskPriorityExecTimeRatio[task.priority],
      );
    }

    this.#averageTaskExecTime = this.#poolExecTime / overallTaskExecTimeRatios;
  }

  #iterate(): void {
    if (!this.#isBusy && this.#taskPool.size > 0) {
      this.#isBusy = true;

      this.#setupTaskQueueAndAverageExecTime();

      let task = this.#taskQueue.remove();
      while (task) {
        const { done, value } = task.worker.next();

        if (done) {
          this.#taskPool.delete(task);
          task.resolve();
        }

        if (value instanceof Error) task.reject(value);

        task = this.#taskQueue.remove();
      }

      setTimeout(() => {
        this.#isBusy = false;
        this.#iterate();
      }, this.#idleTime);
    }
  }

  forEach<T>(
    iterable: Iterable<T>,
    callback: (iterElement: T) => void,
    options: ForEachOptions = { priority: 'average' },
  ): Promise<void> {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new TypeError('Object is not iterable');
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Callback is not a type of function');
    }

    const { priority } = options;
    const worker = this.#createWorker(iterable, callback, priority);

    return new Promise((resolve, reject) => {
      this.#taskPool.add({ worker, priority, resolve, reject });
      this.#iterate();
    });
  }
}
