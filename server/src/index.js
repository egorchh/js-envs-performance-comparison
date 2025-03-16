import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { runInEnvironments } from './runners/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the client build directory in production
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));
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

// Handle client-side routing in production
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(join(__dirname, '../../client/dist/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 