# Домашнее задание #2 - Важнейшие структуры данных: вектор, хеш-таблица, дерево поиска

### 1. Реализация динамического расширяемого массива на основе двусвязного двустороннего списка

Данный тип реализуется классом DynamicArrayImpl и является условной реализацией динамического массива, построенного на базе двусвязного двунаправленного списка.

Идея реализации состоит в том, что узлы списка хранят ссылки на нативные массивы ограниченной (задаваемой на этапе создания экземпляра класса) длины, которые, в свою очередь, хранят данные. Таким образом, при постепенном заполнении такого массива при необходимости создаются дополнительные узлы списка.

При создании экземпляра класса необходимо передать в конструктор максимальную длину узлового массива (положительное целое число).

Класс DynamicArrayImpl предоставляет следующие методы для работы с массивом:

- get - Получение хранимого значения по его индексу
- push - Добавление значения в конец массива
- pop - Извлечение значения с конца массива (если массив пуст, возвращается undefined)
- shift - Извлечение значения из начала массива (если массив пуст, возвращается undefined)
- unshift - Добавление значения в начало массива
- map - Отображение элементов массива на новый массив (оригинальный массив не изменяется)
- filter - Фильтрация элементов массива (оригинальный массив не изменяется)
- join - Преобразование массива в строку посредством объединения элементов задаваемым разделителем (по умолчанию - запятая)
- values - Получение значение элементов массива (возвращает объект генератора)
- toString - Преобразование массива в строку (аналогичен вызову метода join со значением по умолчанию)

Методы map и filter в качестве аргумента принимают callback-функцию (сигнатура аналогична таковой для нативного массива JS).

Кроме этого у экземпляра массива доступен геттер length.

При добавлении/удалении элементов со стороны начала массива осуществляется перемещение всех оставшихся элементов в соответствующую сторону для сохранения очередности следования элементов (без пробелов между элементами). Если массив последнего узла после перестановки не содержит ни одного элемента, узел удаляется.

Массив реализует интерфейс Iterable (может быть перебран в цикле for...of, развернут оператором spread и т.д.).

```js
const array = new DynamicArrayImpl();

array.push(1);
array.push(2);
array.get(0); // 1
array.unshift(3);
array.get(0); // 3

const mapped = array.map((element, index, array) => (index % 2 === 0 ? element : element * 2)); // [6, 1, 4]
const filtered = array.filter((element, index, array) => element < 2); // [1]

console.log(array.join(';')); // '3;1;2'

for (const value of array) {
  console.log(value);
}
```

### 2. Реализация динамического расширяемого массива как вектора

Данный тип реализуется классом VectorImpl и является условной реализацией динамического массива, представляющего собой вектор.

При создании экземпляра класса необходимо передать в конструктор изначальную величину объема буфера (целое положительное число). Далее, при работе с массивом, по мере его наполнения, происходит автоматическое расширение объема буфера (коэффициент расширения задан равным 2, т.е. при нехватке свободных ячеек исходный массив будет расширяться каждый раз вдвое). Буфер реализован нативным массивом JS, без использования встроенных методов.

Класс VectorImpl предоставляет следующие методы для работы с массивом:

- get - Получение хранимого значения по его индексу
- push - Добавление значений в конец массива (допускается передача более одного аргумента)
- pop - Извлечение значения с конца массива (если массив пуст, возвращается undefined)
- shift - Извлечение значения из начала массива (если массив пуст, возвращается undefined)
- unshift - Добавление значений в начало массива (допускается передача более одного аргумента)
- splice - Удаление/добавление элементов (сигнатура аналогична таковой у метода splice нативного массива JS, поддерживается отрицательная величина индекса)
- map - Отображение элементов массива на новый массив (оригинальный массив не изменяется)
- filter - Фильтрация элементов массива (оригинальный массив не изменяется)
- join - Преобразование массива в строку посредством объединения элементов задаваемым разделителем (по умолчанию - запятая)
- values - Получение значение элементов массива (возвращает объект генератора)
- toString - Преобразование массива в строку (аналогичен вызову метода join со значением по умолчанию)

Методы map и filter в качестве аргумента принимают callback-функцию (сигнатура аналогична таковой для нативного массива JS).

Кроме этого у экземпляра массива доступен геттер length.

При добавлении/удалении элементов осуществляется перемещение всех оставшихся элементов в соответствующую сторону для сохранения очередности следования элементов (без пробелов между элементами). Если при добавлении элементов не хватает текущего объема буфера, происходит увеличение объема путем создания нового буфера увеличенного объема и перемещением в него всех существующих элементов.

Массив реализует интерфейс Iterable (может быть перебран в цикле for...of, развернут оператором spread и т.д.).

```js
const vector = new VectorImpl(5);

for (let i = 0; i < 5; i += 1) {
  vector.push(i); // [0, 1, 2, 3, 4]
}

vector.get(3); // 3
vector.get(10); // undefined

vector.unshift(7, 8, 9); // [7, 8, 9, 0, 1, 2, 3, 4]

vector.splice(3, 5, 10, 11, 12); // [0, 1, 2, 3, 4]
console.log(vector.join('-')); // '7-8-9-10-11-12'

const mapped = vector.map((element, index, vector) => element - 7); // [0, 1, 2, 3, 4, 5]
const filtered = vector.filter((element, index, vector) => element % 2 !== 0); // [7, 9, 11]

for (const value of vector) {
  console.log(value);
}
```