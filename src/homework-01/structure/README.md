# Домашнее задание #1 - Фундаментальные структуры данных

### 5. Реализация структуры на базе массива

Данный тип реализуется классом Structure и является условной реализацией структуры (struct), использует для хранения данных массив заранее определенной длины.

При создании экземпляра класса необходимо передать конструктору массив ключей будущей структуры. В дальнейшем доступ к данным осуществляется по данным ключам посредством методов:

- set - Установка значения по ключу
- get - Чтение значения по ключу

При обращении к несуществующему ключу выбрасывается исключение.

Размер массива для хранения значений определяется на этапе создания экземпляра класса по размеру массива ключей, переданного конструктору класса. Отображение ключей на индексы массива осуществляется создаваемой при инстанцировании функцией (кодогенерация посредством конструктора Function).

```js
const struct = new Structure(['name', 'age']);

struct.set('name', 'Max');
struct.set('age', 29);
struct.get('name');
```