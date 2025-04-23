import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();
const PORT = Deno.env.get("PORT") || "5002";

async function createTempFile(code) {
    const tempDir = await Deno.makeTempDir();
    const filePath = `${tempDir}/temp.js`;
    await Deno.writeTextFile(filePath, code);

    return {
        path: filePath,
        cleanup: async () => {
            try {
                await Deno.remove(tempDir, { recursive: true });
            } catch (error) {
                console.error(`Error deleting temp directory: ${error.message}`);
            }
        }
    };
}

async function runInDeno(code, timeout) {
    const { path, cleanup } = await createTempFile(code);

    try {
        const startTime = performance.now();
        const process = new Deno.Command("deno", {
            args: ["run", "--allow-read", path],
            stdout: "piped",
            stderr: "piped",
            stdin: "null",
        });

        const child = process.spawn();

        // Создаем промис для таймаута, который отменит процесс
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                try {
                    // В Deno необходимо использовать kill с правильным сигналом
                    Deno.kill(child.pid, "SIGTERM");
                    reject(new Error(`Execution timed out after ${timeout}ms`));
                } catch (e) {
                    reject(new Error(`Failed to kill process: ${e.message}`));
                }
            }, timeout);
        });

        // Дождемся либо завершения процесса, либо таймаута
        const { stdout, stderr, code: exitCode } = await Promise.race([
            child.output(),
            timeoutPromise
        ]);

        const executionTime = performance.now() - startTime;

        const output = new TextDecoder().decode(stdout);
        const error = new TextDecoder().decode(stderr);

        try {
            await cleanup();
        } catch (err) {
            console.error("Cleanup error:", err);
        }

        if (exitCode === 0) {
            return { executionTime, output };
        } else {
            return { executionTime, error: error || `Process exited with code ${exitCode}` };
        }
    } catch (error) {
        try {
            await cleanup();
        } catch (err) {
            console.error("Cleanup error:", err);
        }
        return { error: error.message };
    }
}

router
    .get("/health", (ctx) => {
        ctx.response.status = 200;
        ctx.response.body = { status: "ok", environment: "deno" };
    })
    .post("/deno-api/run", async (ctx) => {
        try {
            const body = await ctx.request.body().value;
            const { code, timeout = 5000, runs = 1, mode = 'single', commonTimeout } = body;

            if (!code) {
                ctx.response.status = 400;
                ctx.response.body = {
                    status: "error",
                    message: "Code is required"
                };
                return;
            }

            if (mode === 'average' && runs > 1) {
                let totalTime = 0;
                let totalOutput = '';
                let errors = [];

                for (let i = 0; i < runs; i++) {
                    if (commonTimeout && (totalTime > commonTimeout)) {
                        errors.push(`Выполнение прервано по общему таймауту (${commonTimeout}мс). Выполнено ${i} из ${runs} прогонов.`);
                        break;
                    }

                    const result = await runInDeno(code, timeout);

                    if (result.error) {
                        errors.push(result.error);
                        break;
                    }

                    totalTime += result.executionTime;
                    totalOutput += result.output;
                }

                if (errors.length > 0) {
                    ctx.response.status = 200;
                    ctx.response.body = {
                        status: "success",
                        data: {
                            error: errors[0],
                            executionTime: 0
                        }
                    };
                } else {
                    const averageTime = totalTime / runs;
                    ctx.response.status = 200;
                    ctx.response.body = {
                        status: "success",
                        data: {
                            executionTime: averageTime,
                            averageTime: averageTime,
                            totalTime: totalTime,
                            output: totalOutput
                        }
                    };
                }
            } else {
                const result = await runInDeno(code, timeout);

                ctx.response.status = 200;
                ctx.response.body = {
                    status: "success",
                    data: result
                };
            }
        } catch (error) {
            ctx.response.status = 500;
            ctx.response.body = {
                status: "error",
                message: error.message
            };
        }
    });

app.use(oakCors());
app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
    await next();
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use((ctx) => {
    if (ctx.response.status === 404) {
        ctx.response.body = {
            status: "error",
            message: `Route ${ctx.request.url.pathname} not found`
        };
    }
});

console.log(`Deno server running on port ${PORT}`);
await app.listen({ port: Number(PORT) }); 