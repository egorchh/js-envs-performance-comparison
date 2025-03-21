FROM node:20-slim

WORKDIR /app

# Установка curl для загрузки Deno и Bun
RUN apt-get update && apt-get install -y curl unzip

# Установка Deno
ENV DENO_INSTALL=/app/.deno
RUN curl -fsSL https://deno.land/x/install/install.sh | DENO_INSTALL=/app/.deno sh
ENV PATH="/app/.deno/bin:$PATH"

# Установка Bun
ENV BUN_INSTALL=/app/.bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/app/.bun/bin:$PATH"

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

# Указываем порт и переменные окружения для путей к исполняемым файлам
ENV PORT=3000
ENV DENO_PATH=/app/.deno/bin/deno
ENV BUN_PATH=/app/.bun/bin/bun

# Запускаем приложение
CMD ["npm", "start"] 