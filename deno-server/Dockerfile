FROM denoland/deno:1.41.3

WORKDIR /app

COPY . .

RUN deno cache index.js

EXPOSE 5002

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "--allow-run", "index.js"] 