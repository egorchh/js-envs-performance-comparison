FROM node:20-slim

WORKDIR /app

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y curl unzip

# Установка Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="${DENO_INSTALL}/bin:${PATH}"

# Установка Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

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