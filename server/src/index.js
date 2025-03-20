import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runInEnvironments } from './runners/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: [
        'https://egorchh.github.io',
        'http://localhost:5173',
        'https://js-envs-performance-comparison.herokuapp.com'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath, {
        fallthrough: false,
        setHeaders: (res, path) => {
            if (path.endsWith('.html')) {
                res.setHeader('Cache-Control', 'no-cache');
            }
        }
    }));

    // Error handling for static files
    app.use((err, req, res, next) => {
        if (err.status === 404) {
            res.sendFile(join(__dirname, '../../client/dist/index.html'));
        } else {
            next(err);
        }
    });
}

app.post('/api/run', async (req, res) => {
    try {
        const { code, settings } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        const results = await runInEnvironments(code, settings);
        res.json(results);
    } catch (error) {
        console.error('Error running code:', error);
        res.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(join(__dirname, '../../client/dist/index.html'));
    });
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 