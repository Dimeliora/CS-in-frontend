import type { Task, TaskProcessorOptions } from './task-processor.types';

export default class TaskProcessor {
  #poolExecTime: number = 100;

  #taskExecTime: number = this.#poolExecTime;

  #idleTime: number = 100;

  #taskPool: Set<Task> = new Set();

  #isBusy: boolean = false;

  constructor({ poolExecTime, idleTime }: TaskProcessorOptions = {}) {
    if (poolExecTime != null) {
      this.#poolExecTime = poolExecTime;
      this.#taskExecTime = this.#poolExecTime;
    }
    if (idleTime != null) this.#idleTime = idleTime;
  }

  *#createTask<T>(iterable: Iterable<T>, callback: (iterElement: T) => void): Generator<'timeout' | Error> {
    let startTime = performance.now();

    for (const value of iterable) {
      if (performance.now() - startTime > this.#taskExecTime) {
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

  #iterate(): void {
    if (!this.#isBusy && this.#taskPool.size > 0) {
      this.#isBusy = true;
      for (const task of this.#taskPool.values()) {
        const { done, value } = task.worker.next();

        if (done) {
          this.#taskPool.delete(task);
          task.resolve();
        }

        if (value instanceof Error) task.reject(value);
      }

      setTimeout(() => {
        this.#taskExecTime = this.#poolExecTime / (this.#taskPool.size || 1);
        this.#isBusy = false;
        this.#iterate();
      }, this.#idleTime);
    }
  }

  forEach<T>(iterable: Iterable<T>, callback: (iterElement: T) => void): Promise<void> {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new TypeError('Object is not iterable');
    }

    if (typeof callback !== 'function') {
      throw new TypeError('Callback is not a type of function');
    }

    const worker = this.#createTask(iterable, callback);

    return new Promise((resolve, reject) => {
      this.#taskPool.add({ worker, resolve, reject });
      this.#iterate();
    });
  }
}
