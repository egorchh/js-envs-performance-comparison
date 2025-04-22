FROM node:20-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_NODE_API_URL=https://runtimer.ru/node-api
ARG VITE_DENO_API_URL=https://runtimer.ru/deno-api
ARG VITE_BUN_API_URL=https://runtimer.ru/bun-api

ENV VITE_NODE_API_URL=${VITE_NODE_API_URL}
ENV VITE_DENO_API_URL=${VITE_DENO_API_URL}
ENV VITE_BUN_API_URL=${VITE_BUN_API_URL}

RUN npm run build
RUN ls -la /app/dist
RUN find /app/dist -type f | sort

FROM nginx:stable-alpine

# Удаляем стандартные файлы nginx
RUN rm -rf /usr/share/nginx/html/*

# Копируем содержимое сборки в корень nginx
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]