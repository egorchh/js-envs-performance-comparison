import { homedir } from 'os';
import { join } from 'path';
import { file } from 'tmp-promise';
import { writeFile, access, constants } from 'fs/promises';

async function checkExecutable(path) {
    try {
        await access(path, constants.X_OK);
        return true;
    } catch (error) {
        console.error(`File ${path} is not executable:`, error.message);
        return false;
    }
}

export function getRuntimePaths() {
    if (process.env.NODE_ENV === 'production') {
        const denoPath = process.env.DENO_INSTALL ? `${process.env.DENO_INSTALL}/bin/deno` : '/app/.deno/bin/deno';
        const bunPath = process.env.BUN_INSTALL ? `${process.env.BUN_INSTALL}/bin/bun` : '/app/.bun/bin/bun';

        console.log('Runtime paths in production:', {
            denoPath,
            bunPath,
            uid: process.getuid?.() || 'N/A',
            gid: process.getgid?.() || 'N/A',
            cwd: process.cwd()
        });

        return {
            deno: denoPath,
            bun: bunPath
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

// Экспортируем функцию для использования в runners
export { checkExecutable };