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

        const timeoutId = setTimeout(() => {
            try {
                Deno.kill(process.pid, "SIGTERM");
            } catch (e) { }
        }, timeout);

        const { stdout, stderr, code: exitCode } = await process.output();
        clearTimeout(timeoutId);
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
            const { code, timeout = 5000 } = body;

            if (!code) {
                ctx.response.status = 400;
                ctx.response.body = {
                    status: "error",
                    message: "Code is required"
                };
                return;
            }

            const result = await runInDeno(code, timeout);

            ctx.response.status = 200;
            ctx.response.body = {
                status: "success",
                data: result
            };
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