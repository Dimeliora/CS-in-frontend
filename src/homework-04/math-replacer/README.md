# Домашнее задание #4 - Поиск в строке. Регулярные выражения

### 5. Поиск арифметических выражений в строке и замена их на результат их вычисления

Решение задачи представлено классом MathReplacer, который предоставляет единственный статический метод calculate:

```ts
calculate(string: string): string
```

Метод принимает строку, которая может содержать арифметические выражения (литералы чисел, операции +, -, *, /, **, группировки с помощью круглых скобок), осуществляет поиск данных выражений и заменяет их результатами вычислений соответственно.

Если выражение не является валидным с точки зрения синтаксиса JS, выбрасывается исключение типа SyntaxError.

Пример использования:

```js
const text = 'Math expression: (3 + 4) * 2 - 3 ** 2';

MathReplacer.calculate(text); // 'Math expression: 5'
```