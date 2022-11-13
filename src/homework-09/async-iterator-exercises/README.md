# Домашнее задание #9 - Асинхронные итераторы. Реактивные структуры данных

### 1. Реализация функции on, принимающей источник событий и возвращающая асинхронный итератор

Функция выполняет подписку на заданное событие для указанного источника событий, принимает в качестве аргументов любой HTML элемент и имя любого соответствующего этому элементу события:

```ts
on<E extends keyof HTMLElementEventMap>(source: HTMLElement, eventType: E): AsyncIterable<HTMLElementEventMap[E]>
```

Пример использования:

```js
for await (const event of on(document.body, 'click')) {
  console.log(event);
}
```

### 2. Реализация функции once, принимающей источник событий и возвращающая асинхронный итератор

Функция выполняет однократную подписку на заданное событие для указанного источника событий (подписка снимается после срабатывания), принимает в качестве аргументов любой HTML элемент и имя любого соответствующего этому элементу события:

```ts
once<E extends keyof HTMLElementEventMap>(source: HTMLElement, eventType: E): AsyncIterable<HTMLElementEventMap[E]>
```

Пример использования:

```js
for await (const event of once(document.body, 'click')) {
  console.log(event);
}
```

### 3. Реализация функции take, работающей с асинхронно перебираемыми объектами

Функция принимает аргументами async iterable объект и число итерируемых элементов, возвращает асинхронный перебираемый итератор:

```ts
take<T>(iterable: AsyncIterable<T>, takesCount: number): AsyncIterableIterator<T>
```

Пример использования:

```js
for await (const event of take(on(document.body, 'click'), 3)) {
  console.log(event);
}
```

### 4. Реализация функции map, работающей с асинхронно перебираемыми объектами

Функция принимает аргументами async iterable объект и функцию обратного вызова для отображения итерируемых элементов, возвращает асинхронный перебираемый итератор:

```ts
map<T, M>(iterable: AsyncIterable<T>, mapper: (element: T, index: number, iterable: AsyncIterable<T>) => M): AsyncIterableIterator<M>
```

Пример использования:

```js
for await (const x of map(on(document.body, 'click'), (event) => ({ event.clientX }))) {
  console.log(x);
}
```

### 5. Реализация функции filter, работающей с асинхронно перебираемыми объектами

Функция принимает аргументами async iterable объект и функцию-предикат, возвращает асинхронный перебираемый итератор:

```ts
filter<T>(iterable: AsyncIterable<T>, predicate: (element: T, index: number, iterable: AsyncIterable<T>) => boolean): AsyncIterableIterator<T>
```

Пример использования:

```js
for await (const event of filter(on(document.body, 'click'), (event) => event.clientX > 500)) {
  console.log(event);
}
```

### 6. Реализация функции seq, работающей с асинхронно перебираемыми объектами

Функция принимает один и более async iterable объектов и возвращает асинхронный перебираемый итератор по элементам этих объектов:

```ts
seq<T extends AsyncIterable<any>[]>(...iterables: T): AsyncIterableIterator<ExtractAsyncIterablesType<T>>
```

Пример использования:

```js
for await (const event of seq(once(document.body, 'click'), once(document.body, 'keyup'))) {
  console.log(event);
}
```
