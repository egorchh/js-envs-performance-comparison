import '@testing-library/jest-dom';

// Мок для Monaco Editor
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

// Мок для Chart.js
jest.mock('react-chartjs-2', () => ({
  Bar: () => null,
}));

// Мок для react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  Toaster: jest.fn().mockImplementation(() => null),
}));

// Мок для import.meta.env
global.import = {
  meta: {
    env: {
      VITE_NODE_API_URL: '/node-api',
      VITE_DENO_API_URL: '/deno-api',
      VITE_BUN_API_URL: '/bun-api',
      VITE_API_URL: 'https://test-api.example.com',
      MODE: 'test',
    },
  },
} as any;

// Переопределение import.meta для прямого использования в коде
Object.defineProperty(globalThis, 'import', {
  value: global.import
});

// Мок для fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Мок для API
jest.mock('./api', () => ({
  runCodeAsync: jest.fn().mockImplementation(async () => {
    return {
      status: 'success',
      data: {
        node: {
          executionTime: 100,
          output: 'Test output'
        },
        deno: {
          executionTime: 120,
          output: 'Test output'
        },
        bun: {
          executionTime: 80,
          output: 'Test output'
        }
      }
    };
  }),
}));