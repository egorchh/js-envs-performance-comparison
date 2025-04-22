import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const PORT = process.env.PORT || 5003;

async function createTempFile(code) {
    const tempDir = tmpdir();
    const filePath = join(tempDir, `${randomUUID()}.js`);
    await fs.writeFile(filePath, code);
    return {
        path: filePath,
        cleanup: async () => {
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error(`Error deleting temp file: ${error.message}`);
            }
        }
    };
}

async function runInBun(code, timeout) {
    const { path, cleanup } = await createTempFile(code);

    try {
        const startTime = performance.now();

        const bunProcess = Bun.spawn(['bun', 'run', path], {
            stdout: 'pipe',
            stderr: 'pipe',
            stdin: 'inherit',
            onExit(proc, exitCode, signalCode, error) {
                if (error) console.error('Process error:', error);
            }
        });

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                bunProcess.kill();
                reject(new Error(`Execution timed out after ${timeout}ms`));
            }, timeout);
        });

        const output = await Promise.race([
            new Response(bunProcess.stdout).text(),
            timeoutPromise
        ]);

        let error = '';
        try {
            error = await new Response(bunProcess.stderr).text();
        } catch (e) {
            // Игнорируем ошибки чтения stderr
        }

        const executionTime = performance.now() - startTime;

        try {
            await cleanup();
        } catch (err) {
            console.error("Cleanup error:", err);
        }

        if (error) {
            return { executionTime, error };
        } else {
            return { executionTime, output };
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

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

const server = Bun.serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);

        if (req.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (url.pathname === '/health' && req.method === 'GET') {
            return Response.json(
                { status: 'ok', environment: 'bun' },
                { headers: corsHeaders }
            );
        }

        if (url.pathname === '/bun-api/run' && req.method === 'POST') {
            try {
                const { code, timeout = 5000 } = await req.json();

                if (!code) {
                    return Response.json(
                        { status: 'error', message: 'Code is required' },
                        { status: 400, headers: corsHeaders }
                    );
                }

                const result = await runInBun(code, timeout);

                return Response.json(
                    { status: 'success', data: result },
                    { headers: corsHeaders }
                );
            } catch (error) {
                return Response.json(
                    { status: 'error', message: error.message },
                    { status: 500, headers: corsHeaders }
                );
            }
        }

        return Response.json(
            { error: `Route ${url.pathname} not found` },
            { status: 404, headers: corsHeaders }
        );
    }
});

console.log(`Bun server running on port ${PORT}`); 