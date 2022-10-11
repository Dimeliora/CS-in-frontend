import type { Key, KeyMapFunction, Structure } from './structure.interface';

export default class StructureImpl<T = unknown> implements Structure<T> {
  #data: T[];

  #getIndexByKey: KeyMapFunction;

  static #getKeyIndexMapperFunction(keys: Key[]): string {
    const mapCases = keys.map((key, index) => `case '${key}': return ${index};`).join('\n');

    const mappedFunctionBody = `
      {
        switch (key) {
          ${mapCases}
          default:
            throw new Error('Key not found');
          }
      }
    `;

    return mappedFunctionBody;
  }

  constructor(keys: Key[]) {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('Array of keys must be provided');
    }

    this.#data = Array(keys.length);

    const mappedFunctionBody = StructureImpl.#getKeyIndexMapperFunction(keys);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    this.#getIndexByKey = <KeyMapFunction>new Function('key', mappedFunctionBody);
  }

  set(key: Key, value: T) {
    const index = this.#getIndexByKey(key);
    this.#data[index] = value;
  }

  get(key: Key) {
    const index = this.#getIndexByKey(key);
    return this.#data[index] ?? null;
  }
}
