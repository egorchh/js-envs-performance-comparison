import { spawn } from 'child_process';
import { createTempFile, getRuntimePaths } from '../utils/index.js';

export async function runInBun(code, timeout) {
    const { path, cleanup } = await createTempFile(code);
    const { bun: BUN_PATH } = getRuntimePaths();

    try {
        const startTime = performance.now();
        const bunProcess = spawn(BUN_PATH, ['run', path], {
            timeout,
            env: { ...process.env }
        });

        return new Promise((resolve) => {
            let output = '';
            let error = '';

            bunProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            bunProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            bunProcess.on('close', (code) => {
                const executionTime = performance.now() - startTime;
                cleanup();
                if (code === 0) {
                    resolve({ executionTime, output });
                } else {
                    resolve({ executionTime, error: error || 'Process exited with code ' + code });
                }
            });

            bunProcess.on('error', (err) => {
                cleanup();
                resolve({ error: err.message });
            });
        });
    } catch (error) {
        cleanup();
        return { error: error.message };
    }
}
