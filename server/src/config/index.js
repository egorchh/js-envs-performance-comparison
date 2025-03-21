export const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    cors: {
        origin: [
            'https://egorchh.github.io',
            'http://localhost:5173'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    },
    defaultTimeout: 5000,
    defaultRuns: 3
}; 