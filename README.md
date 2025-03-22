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

### Серверная часть

1. Перейдите в директорию сервера:
```bash
cd server
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите режим разработки:
```bash
npm run dev
```

Сервер будет доступен по адресу `http://localhost:5555`

## 🐳 Запуск в Docker

Проект контейнеризирован и может быть запущен с помощью Docker Compose.

1. Убедитесь, что у вас установлен Docker и Docker Compose

2. Запустите контейнеры:
```bash
docker-compose up -d
```

После запуска:
- Клиент будет доступен по адресу: `http://localhost:3000/js-envs-performance-comparison/`
- Сервер будет доступен по адресу: `http://localhost:5555`

Для остановки контейнеров:
```bash
docker-compose down
```

## 📦 Деплой

### GitHub Pages (Клиент)

Клиентская часть деплоится автоматически на Github Pages после пуша в мастер ветку.

### Heroku (Сервер)

1. Установите [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. Войдите в аккаунт Heroku:
```bash
heroku login
```

3. Создайте новое приложение:
```bash
heroku create js-envs-performance-comparison
```

4. Настройте переменные окружения:
```bash
heroku config:set NODE_ENV=production
```

5. Деплой на Heroku:
```bash
git subtree push --prefix server heroku main
```

Или используйте автоматический деплой через GitHub, подключив репозиторий в настройках Heroku.

## 🔧 Переменные окружения

### Клиент
- `VITE_API_URL` - URL API сервера (по умолчанию http://localhost:5555)

### Сервер
- `PORT` - Порт сервера (по умолчанию 5555)
- `NODE_ENV` - Окружение (development/production)

## 📝 Примечания

- Убедитесь, что у вас установлен Node.js версии 18 или выше
- При локальной разработке клиент и сервер должны быть запущены одновременно
- В production окружении рекомендуется использовать Docker для упрощения развертывания

## Требования

- Node.js 20+
- Deno 1.38+
- Bun 1.0+

## Функциональность

- Редактор кода с подсветкой синтаксиса
- Настройка таймаута выполнения
- Различные режимы выполнения (Множественный запуск, Одиночный, Асинхронный)
- Визуализация результатов в виде диаграммы
- Подготовленные пресеты для быстрой проверки сценариев
