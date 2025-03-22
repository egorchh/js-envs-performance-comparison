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

# Копируем файлы package.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm i

# Копируем исходный код
COPY . .

# Указываем порт
ENV PORT=3000

# Запускаем приложение
CMD ["npm", "start"]