import { spawn } from 'child_process';
import { createTempFile, getRuntimePaths } from '../utils/index.js';

export async function runInDeno(code, timeout) {
    const { path, cleanup } = await createTempFile(code);
    const { deno: DENO_PATH } = getRuntimePaths();

    try {
        // Проверяем наличие Deno
        const denoVersionProcess = spawn(DENO_PATH, ['--version']);
        await new Promise((resolve, reject) => {
            denoVersionProcess.on('error', () => {
                reject(new Error('Deno is not installed or not accessible'));
            });
            denoVersionProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error('Failed to verify Deno installation'));
                }
                resolve();
            });
        });

        const startTime = performance.now();
        const denoProcess = spawn(DENO_PATH, ['run', '--no-check', path], {
            timeout,
            env: { ...process.env }
        });

        return new Promise((resolve) => {
            let output = '';
            let error = '';

            denoProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            denoProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            denoProcess.on('close', (code) => {
                const executionTime = performance.now() - startTime;
                cleanup();
                if (code === 0) {
                    resolve({ executionTime, output });
                } else {
                    resolve({ executionTime, error: error || 'Process exited with code ' + code });
                }
            });

            denoProcess.on('error', (err) => {
                cleanup();
                resolve({ error: err.message });
            });
        });
    } catch (error) {
        cleanup();
        return { error: error.message };
    }
}
