import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { promises as fs } from 'fs';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

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
                cleanup().catch(console.error);

                if (code === 0) {
                    resolve({ executionTime, output });
                } else {
                    resolve({ executionTime, error: error || `Process exited with code ${code}` });
                }
            });

            nodeProcess.on('error', (err) => {
                cleanup().catch(console.error);
                resolve({ error: err.message });
            });
        });
    } catch (error) {
        await cleanup().catch(console.error);
        return { error: error.message };
    }
}

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        status,
        message: err.message
    });
};

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', environment: 'node' });
});

app.post('/node-api/run', async (req, res, next) => {
    try {
        const { code, timeout = 5000, runs = 1, mode = 'single', commonTimeout } = req.body;

        console.log(commonTimeout);

        if (!code) {
            return res.status(400).json({
                status: 'error',
                message: 'Code is required'
            });
        }

        if (mode === 'average' && runs > 1) {
            let totalTime = 0;
            let totalOutput = '';
            let errors = [];

            for (let i = 0; i < runs; i++) {
                if (commonTimeout && (totalTime > commonTimeout)) {
                    errors.push(`Выполнение прервано по общему таймауту (${commonTimeout}мс). Выполнено ${i} из ${runs} прогонов.`);
                    break;
                }

                const result = await runInNode(code, timeout);

                if (result.error) {
                    errors.push(result.error);
                    break;
                }

                totalTime += result.executionTime;
                totalOutput += result.output;
            }

            if (errors.length > 0) {
                res.status(200).json({
                    status: 'success',
                    data: {
                        error: errors[0],
                        executionTime: 0
                    }
                });
            } else {
                const averageTime = totalTime / runs;
                res.status(200).json({
                    status: 'success',
                    data: {
                        executionTime: averageTime,
                        averageTime: averageTime,
                        totalTime: totalTime,
                        output: totalOutput
                    }
                });
            }
        } else {
            const result = await runInNode(code, timeout);

            res.status(200).json({
                status: 'success',
                data: result
            });
        }
    } catch (error) {
        next(error);
    }
});

app.use(errorHandler);

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`
    });
});

const server = app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.error(`Unhandled rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error(`Uncaught exception: ${err.message}`);
    process.exit(1);
}); 