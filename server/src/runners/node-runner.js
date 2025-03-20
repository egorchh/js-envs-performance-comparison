import { spawn } from 'child_process';
import { createTempFile } from '../utils/index.js';

export async function runInNode(code, timeout) {
    const { path, cleanup } = await createTempFile(code);

    try {
        const startTime = performance.now();
        const nodeProcess = spawn('node', [path], {
            timeout,
            env: { ...process.env, NODE_ENV: 'production' }
        });

        return new Promise((resolve) => {
            let output = '';
            let error = '';

            nodeProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            nodeProcess.stderr.on('data', (data) => {
                error += data.toString();
            });

            nodeProcess.on('close', (code) => {
                const executionTime = performance.now() - startTime;
                cleanup(); // Удаляем файл после выполнения
                if (code === 0) {
                    resolve({ executionTime, output });
                } else {
                    resolve({ executionTime, error: error || 'Process exited with code ' + code });
                }
            });

            nodeProcess.on('error', (err) => {
                cleanup(); // Удаляем файл в случае ошибки
                resolve({ error: err.message });
            });
        });
    } catch (error) {
        cleanup(); // Удаляем файл в случае исключения
        return { error: error.message };
    }
}