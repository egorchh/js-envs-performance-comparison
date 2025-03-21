import { homedir } from 'os';
import { join } from 'path';
import { file } from 'tmp-promise';
import { writeFile } from 'fs/promises';

export function getRuntimePaths() {
    if (process.env.NODE_ENV === 'production') {
        return {
            deno: process.env.DENO_PATH || 'deno',
            bun: process.env.BUN_PATH || 'bun'
        };
    }

    return {
        deno: join(homedir(), '.deno', 'bin', 'deno'),
        bun: join(homedir(), '.bun', 'bin', 'bun')
    };
}

export async function createTempFile(code) {
    const { path, cleanup } = await file({
        postfix: '.js',
        keep: true
    });
    await writeFile(path, code);
    return { path, cleanup };
}

export async function runMultipleTimes(runner, code, timeout, runs) {
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
        totalTime: results.reduce((a, b) => a + b, 0),
    };
}