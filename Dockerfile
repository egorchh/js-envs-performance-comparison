FROM node:20-slim

WORKDIR /app

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y curl unzip

# Создаем директории для Deno и Bun
RUN mkdir -p /app/.deno/bin
RUN mkdir -p /app/.bun/bin

# Установка Deno
ENV DENO_INSTALL=/app/.deno
RUN curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/app/.deno sh \
    && ln -s /app/.deno/bin/deno /usr/local/bin/deno

# Установка Bun
ENV BUN_INSTALL=/app/.bun
RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/app/.bun bash \
    && ln -s /app/.bun/bin/bun /usr/local/bin/bun

# Добавляем в PATH и устанавливаем переменные окружения
ENV PATH="/app/.deno/bin:/app/.bun/bin:${PATH}"
ENV DENO_PATH=/app/.deno/bin/deno
ENV BUN_PATH=/app/.bun/bin/bun

# Проверяем установку
RUN deno --version && bun --version

# Установка правильных прав
RUN chmod -R 755 /app/.deno
RUN chmod -R 755 /app/.bun

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