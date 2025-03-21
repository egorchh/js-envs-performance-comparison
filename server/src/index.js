import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from './config/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import codeRoutes from './routes/code.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors(config.cors));
app.use(express.json({ limit: '10kb' }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api', codeRoutes);

if (config.nodeEnv === 'production') {
    const clientBuildPath = join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
        res.sendFile(join(clientBuildPath, 'index.html'));
    });
}

app.use(errorHandler);

app.all('*', (req, res, next) => {
    next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

const server = app.listen(config.port, () => {
    console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
}); 