# Домашнее задание #8 - Асинхронное программирование. Функции обратного вызова. Монадические контейнеры для асинхронного программирования

### 1. Реализация функции sleep

Функция sleep предназначена для реализации временной задержки, принимает аргументом количество милисекунд, возвращает промис:

```ts
sleep(ms: number): Promise<void>
```

Пример использования:

```js
sleep(2000).then(() => {
  console.log('After 2 seconds');
});
```
