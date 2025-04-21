FROM oven/bun:1.1.16-slim

WORKDIR /app

COPY package.json .
COPY bun.lockb* .
RUN bun install --production

COPY . .

EXPOSE 5003

CMD ["bun", "run", "start"] 