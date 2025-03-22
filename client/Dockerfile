FROM node:18.19-alpine3.19 as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN npm run build

FROM nginx:1.25.4-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]