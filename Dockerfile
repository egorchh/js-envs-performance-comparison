FROM node:20-slim

WORKDIR /app

# Установка curl для загрузки Deno и Bun
RUN apt-get update && apt-get install -y curl unzip

# Установка Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh

# Установка Bun
RUN curl -fsSL https://bun.sh/install | bash

# Добавление Deno и Bun в PATH
ENV PATH="/root/.deno/bin:$PATH"
ENV PATH="/root/.bun/bin:$PATH"

# Копируем файлы package.json
COPY package.json ./
COPY server/package.json ./server/

# Устанавливаем зависимости
RUN npm ci
RUN cd server && npm ci

# Копируем исходный код
COPY . .

# Указываем порт
ENV PORT=3000

# Запускаем приложение
CMD ["npm", "start"] 