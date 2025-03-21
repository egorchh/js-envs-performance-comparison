FROM node:20-slim

WORKDIR /app

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y curl unzip

# Создаем пользователя
RUN useradd -m appuser

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
RUN chmod +x /app/.deno/bin/deno && chmod +x /app/.bun/bin/bun

# Проверяем установку
RUN deno --version && bun --version

# Копируем файлы package.json
COPY package.json ./
COPY server/package.json ./server/

# Устанавливаем зависимости
RUN npm i
RUN cd server && npm i

# Копируем исходный код
COPY . .

# Указываем порт
ENV PORT=3000

# Запускаем приложение
CMD ["npm", "start"]