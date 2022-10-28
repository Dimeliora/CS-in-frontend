# Домашнее задание #6 - Автоматы и генераторы

### 1. Реализация функции forEach для обхода iterable-объекта любого размера (без блокирования потока ввода/вывода)

Реализованная функция принимает iterable, функцию обратного вызова, принимающую аргументом элемент перебираемого объекта, возвращает промис.

Логика работы функции основана на ограничении времени работы по перебору элементов. При достижении временного ограничения выдерживается пауза и перебор возобновляется. Время работы/выдержки задано равным 100мс.

```ts
forEach<T>(iterable: Iterable<T>, callback: (iterableElement: T) => void): Promise<void>
```

Логика реализации разделена между дополнительными функциями. Обход элементов с контролем времени перебора осуществляется генератором, создаваемым функцией createGenerator

```ts
function* createGenerator<T>(
  iterator: Iterator<T>,
  execTime: number,
  callback: (iterableElement: T) => void,
): Generator<'timeout', undefined>;
```

Перезапуск перебора после выдержки времени паузы, а также контроль окончания перебора ложатся на функцию iterate

```ts
iterate<T>(generator: Generator<T>, releaseTime: number, resolve: (value?: any) => void): void
```

Пример использования:

```js
const array = [...Array(5e5)];
let count = 0;

console.log('Started!');

forEach(array, () => {
  count += 1;
}).then(() => {
  console.log(count); // 5e5
  console.log('Finished!');
});
```
