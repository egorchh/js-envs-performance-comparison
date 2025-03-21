import { spawn } from 'child_process';
import { createTempFile, getRuntimePaths, checkExecutable } from '../utils/index.js';

export async function runInDeno(code, timeout) {
    const { path, cleanup } = await createTempFile(code);
    const { deno: DENO_PATH } = getRuntimePaths();

    console.log(`Attempting to run Deno at path: ${DENO_PATH}`);

    try {
        // Проверяем доступность файла
        const isExecutable = await checkExecutable(DENO_PATH);
        if (!isExecutable) {
            throw new Error(`Deno binary at ${DENO_PATH} is not executable`);
        }

        // Проверяем наличие Deno
        const denoVersionProcess = spawn(DENO_PATH, ['--version']);
        await new Promise((resolve, reject) => {
            let versionOutput = '';

            denoVersionProcess.stdout.on('data', (data) => {
                versionOutput += data.toString();
            });

            denoVersionProcess.stderr.on('data', (data) => {
                console.error(`Deno version check stderr: ${data}`);
            });

            denoVersionProcess.on('error', (err) => {
                console.error(`Failed to start Deno: ${err.message}`);
                reject(new Error(`Deno is not installed or not accessible at ${DENO_PATH}`));
            });

            denoVersionProcess.on('close', (code) => {
                if (code !== 0) {
                    console.error(`Deno version check failed with code ${code}`);
                    reject(new Error(`Failed to verify Deno installation (exit code: ${code})`));
                }
                console.log(`Deno version: ${versionOutput.trim()}`);
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
