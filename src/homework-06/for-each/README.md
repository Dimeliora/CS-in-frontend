# Домашнее задание #6 - Автоматы и генераторы

### 1. Реализация функции forEach для обхода iterable-объекта любого размера (без блокирования потока ввода/вывода)

Реализованная функция принимает iterable, функцию обратного вызова, принимающую аргументом элемент перебираемого объекта, возвращает промис.

Логика работы функции основана на ограничении времени работы по перебору элементов. При достижении временного ограничения выдерживается пауза и перебор возобновляется. Время работы/выдержки задано равным 100мс.

```ts
forEach<T>(iterable: Iterable<T>, callback: (iterableElement: T) => void): Promise<void>
```

Логика реализации инкапсулирована в класс TaskWorker, при вызове функции forEach создаётся экземпляр класса, в конструктор которого передаются исходные iterable и функция обратного вызова. Обход элементов запускается вызовом публичного метода iterate.

Обход элементов с контролем времени перебора осуществляется генератором, создаваемым методом createWorker

```ts
*createWorker(iterator: Iterator<T>, callback: (iterElement: T) => void): Generator<'timeout' | Error>
```

Перезапуск перебора после выдержки времени паузы, а также контроль окончания перебора и обработки возможного исключения ложатся на метод iterate

```ts
iterate(resolve: (v?: any) => void, reject: (r?: any) => void): unknown
```

Пример использования:

```js
const numbers = [...Array(5e5).keys()];
let sumOfNums = 0;

forEach(array, (num) => {
  sumOfNums += num;
}).then(() => {
  console.log(sumOfNums); // 5e5
  console.log('Finished!');
});

const array = [...Array(100).keys()];
array[50] = String(array[50]);

forEach(array, (el) => {
  console.log(el.toFixed(2));
})
  .then(() => {
    console.log('Finished!');
  })
  .catch(console.error); // TypeError: el.toFixed is not a function
```
