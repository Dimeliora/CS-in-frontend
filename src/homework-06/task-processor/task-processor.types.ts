export interface Task {
  worker: Generator<'timeout' | Error>;
  resolve: (v?: any) => void;
  reject: (r?: any) => void;
}

export interface TaskProcessorOptions {
  poolExecTime?: number;
  idleTime?: number;
}
