# JavaScript Environments Performance Comparison

Приложение для сравнения производительности различных сред исполнения JavaScript (Node.js, Deno, Bun).

## Требования

- Node.js 20+
- Deno 1.38+
- Bun 1.0+

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/js-envs-performance-comparison.git
cd js-envs-performance-comparison
```

2. Установите зависимости для клиентской части:
```bash
cd client
npm install
```

3. Установите зависимости для серверной части:
```bash
cd ../server
npm install
```

## Запуск для разработки

1. Запустите сервер:
```bash
cd server
npm run dev
```

2. В другом терминале запустите клиентскую часть:
```bash
cd client
npm run dev
```

## Сборка для продакшена

1. Соберите клиентскую часть:
```bash
cd client
npm run build
```

2. Запустите сервер в продакшен режиме:
```bash
cd ../server
NODE_ENV=production npm start
```

## Использование

1. Откройте приложение в браузере (по умолчанию http://localhost:5173 для разработки)
2. Введите JavaScript код в редактор
3. Настройте параметры выполнения:
   - Выберите среды исполнения
   - Установите таймаут
   - Выберите режим выполнения (одиночный/средний/асинхронный)
4. Нажмите "Запустить"
5. Просмотрите результаты в виде графика и текстового вывода

## Функциональность

- Редактор кода с подсветкой синтаксиса
- Поддержка ESM и CommonJS модулей
- Выбор версий сред исполнения
- Настройка таймаута выполнения
- Различные режимы выполнения
- Визуализация результатов
- История тестов
- Экспорт результатов 