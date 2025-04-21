import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
    return {
            plugins: [react()],
            base: '/',
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src')
                }
            },
            server: {
                port: 3000,
                proxy: {
                    '/api': {
                    target: env.VITE_API_URL || 'http://localhost:5555',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                    }
                }
            },
    }
})
