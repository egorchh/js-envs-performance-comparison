# JS Environments Performance Comparison

Проект для сравнения производительности сред исполнения серверного JavaScript кода: NodeJS, Deno, Bun.

#### Desktop версия

<img width="1501" alt="Screenshot 2025-03-22 at 17 44 26" src="https://github.com/user-attachments/assets/3f053bd2-cce6-48f3-9d85-5094583b574b" />
<img width="495" alt="Screenshot 2025-03-22 at 17 44 34" src="https://github.com/user-attachments/assets/a85a2b7b-a06f-4777-b462-c607bc631036" />

#### Mobile версия

<img width="411" alt="Screenshot 2025-03-22 at 17 55 34" src="https://github.com/user-attachments/assets/c32bc85c-0c93-4990-a8a4-1e695de13f45" />
<img width="415" alt="Screenshot 2025-03-22 at 17 56 33" src="https://github.com/user-attachments/assets/abb68477-0b21-4265-ae99-4abc5a53f371" />

#### Обработка ошибок

<img width="411" alt="Screenshot 2025-03-22 at 17 55 50" src="https://github.com/user-attachments/assets/7aab89e1-9f6a-444a-887a-fec9ecda56b6" />

## 🚀 Архитектура проекта

Проект разделен на четыре основных компонента, каждый запускается в отдельном Docker-контейнере:

1. **Клиент** - React приложение для ввода и запуска JavaScript кода
2. **Node.js сервер** - Запускает тесты JavaScript кода только в Node.js
3. **Deno сервер** - Запускает тесты JavaScript кода только в Deno
4. **Bun сервер** - Запускает тесты JavaScript кода только в Bun

Клиент отправляет параллельные запросы ко всем трем серверам и визуализирует результаты производительности в едином интерфейсе.

## 🚀 Локальная разработка

### Клиентская часть

1. Перейдите в директорию клиента:
```bash
cd client
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите режим разработки:
```bash
npm run dev
```

Клиент будет доступен по адресу `http://localhost:3000/js-envs-performance-comparison/`

### Node.js Сервер

1. Перейдите в директорию Node.js сервера:
```bash
cd node-server
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите режим разработки:
```bash
npm run dev
```

Сервер будет доступен по адресу `http://localhost:5001`

### Deno Сервер

1. Перейдите в директорию Deno сервера:
```bash
cd deno-server
```

2. Запустите сервер:
```bash
deno run --allow-net --allow-env --allow-read --allow-write --allow-run index.js
```

Сервер будет доступен по адресу `http://localhost:5002`

### Bun Сервер

1. Перейдите в директорию Bun сервера:
```bash
cd bun-server
```

2. Установите зависимости:
```bash
bun install
```

3. Запустите сервер:
```bash
bun run index.js
```

Сервер будет доступен по адресу `http://localhost:5003`

## 🐳 Запуск с Docker Compose

Проект может быть запущен в Docker с помощью Docker Compose для развертывания всей инфраструктуры одной командой.

### Запуск всех сервисов

```bash
docker-compose up -d
```

После запуска:
- Клиент будет доступен по адресу: `http://localhost:3000/js-envs-performance-comparison/`
- Node.js сервер: `http://localhost:5001`
- Deno сервер: `http://localhost:5002`
- Bun сервер: `http://localhost:5003`

Для остановки контейнеров:
```bash
docker-compose down
```

### Запуск отдельного сервиса

Для запуска только одного сервиса, например, клиента:
```bash
docker-compose up -d client
```

## 📝 Требования

- Docker и Docker Compose для контейнеризации
- Node.js 20+ (для локальной разработки)
- Deno 1.38+ (для локальной разработки)
- Bun 1.0+ (для локальной разработки)

## 🚀 Функциональность

- Редактор кода с подсветкой синтаксиса
- Настройка таймаута выполнения
- Выбор сред исполнения для тестирования
- Визуализация результатов в виде диаграммы
- Подготовленные пресеты кода для быстрой проверки в разных сценариях
