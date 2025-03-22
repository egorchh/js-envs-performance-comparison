FROM node:20-slim

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y curl unzip

# Устанавливаем Deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
ENV DENO_INSTALL="/root/.deno"
ENV PATH="$DENO_INSTALL/bin:$PATH"

# Устанавливаем Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Создаем рабочую директорию
WORKDIR /app

# Копируем файлы package*.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости с использованием npm ci для воспроизводимой сборки
RUN npm ci

# Копируем исходный код
COPY . .

# Указываем порт
ENV PORT=3000
EXPOSE 3000

# Проверяем наличие необходимых файлов и директорий
RUN ls -la
RUN echo "Current directory:" && pwd
RUN echo "Contents of src:" && ls -la src

# Запускаем приложение
CMD ["npm", "start"]