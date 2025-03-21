FROM node:20-slim

WORKDIR /app

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y curl unzip

# Создаем директории для Deno и Bun
RUN mkdir -p /app/.deno /app/.bun

# Установка Deno
ENV DENO_INSTALL="/app/.deno"
RUN curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/app/.deno sh
ENV PATH="/app/.deno/bin:${PATH}"

# Установка Bun
ENV BUN_INSTALL="/app/.bun"
RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/app/.bun bash
ENV PATH="/app/.bun/bin:${PATH}"

# Устанавливаем правильные права доступа
RUN chmod -R 755 /app/.deno /app/.bun \
    && chown -R 1000:1000 /app/.deno /app/.bun

# Проверяем установку
RUN deno --version && bun --version

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