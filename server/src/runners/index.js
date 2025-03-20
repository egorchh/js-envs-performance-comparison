import { runMultipleTimes } from '../utils/index.js';
import { runInNode } from './node-runner.js';
import { runInBun } from './bun-runner.js';
import { runInDeno } from './deno-runner.js';

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