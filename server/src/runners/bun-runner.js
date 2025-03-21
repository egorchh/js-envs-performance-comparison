import { spawn } from 'child_process';
import { createTempFile, getRuntimePaths, checkExecutable } from '../utils/index.js';

export async function runInBun(code, timeout) {
    const { path, cleanup } = await createTempFile(code);
    const { bun: BUN_PATH } = getRuntimePaths();

    console.log(`Attempting to run Bun at path: ${BUN_PATH}`);

    try {
        // Проверяем доступность файла
        const isExecutable = await checkExecutable(BUN_PATH);
        if (!isExecutable) {
            throw new Error(`Bun binary at ${BUN_PATH} is not executable`);
        }

        // Проверяем наличие Bun
        const bunVersionProcess = spawn(BUN_PATH, ['--version']);
        await new Promise((resolve, reject) => {
            let versionOutput = '';

            bunVersionProcess.stdout.on('data', (data) => {
                versionOutput += data.toString();
            });

            bunVersionProcess.stderr.on('data', (data) => {
                console.error(`Bun version check stderr: ${data}`);
            });

            bunVersionProcess.on('error', (err) => {
                console.error(`Failed to start Bun: ${err.message}`);
                reject(new Error(`Bun is not installed or not accessible at ${BUN_PATH}`));
            });

            bunVersionProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Bun version check failed with code ${code}`);
                    reject(new Error(`Failed to verify Bun installation (exit code: ${code})`));
                }
                console.log(`Bun version: ${versionOutput.trim()}`);
                resolve();
            });
        });

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
