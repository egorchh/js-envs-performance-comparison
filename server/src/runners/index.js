import { spawn } from 'child_process';
import { file } from 'tmp-promise';
import { writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_RUNS = 3;

// Функция для получения путей к исполняемым файлам
function getRuntimePaths() {
    return {
        deno: join(homedir(), '.deno', 'bin', 'deno'),
        bun: join(homedir(), '.bun', 'bin', 'bun')
    };
}

async function createTempFile(code) {
    const { path, cleanup } = await file({
        postfix: '.js',
        keep: true // Сохраняем файл до явного удаления
    });
    await writeFile(path, code);
    return { path, cleanup };
}

async function runInNode(code, timeout) {
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

async function runInDeno(code, timeout) {
    const { path, cleanup } = await createTempFile(code);
    const { deno: DENO_PATH } = getRuntimePaths();

    try {
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

async function runInBun(code, timeout) {
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

async function runMultipleTimes(runner, code, timeout, runs) {
    const results = [];

    for (let i = 0; i < runs; i++) {
        const result = await runner(code, timeout);
        if (result.error) {
            return result;
        }
        results.push(result.executionTime);
    }

    const averageTime = results.reduce((a, b) => a + b, 0) / results.length;
    return {
        averageTime,
        executionTime: results[0],
    };
}

export async function runInEnvironments(code, settings = {}) {
    const timeout = settings.timeout || DEFAULT_TIMEOUT;
    const runs = settings.mode === 'average' ? (settings.runs || DEFAULT_RUNS) : 1;
    const results = {};

    const runners = {
        node: settings.environments?.node && runInNode,
        deno: settings.environments?.deno && runInDeno,
        bun: settings.environments?.bun && runInBun,
    };

    for (const [env, runner] of Object.entries(runners)) {
        if (runner) {
            try {
                if (settings.mode === 'average') {
                    results[env] = await runMultipleTimes(runner, code, timeout, runs);
                } else {
                    results[env] = await runner(code, timeout);
                }
            } catch (error) {
                results[env] = { error: error.message };
            }
        }
    }

    return results;
} 