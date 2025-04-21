import { isDevelopment } from '../constants';
import { EnvironmentData, RunCodeResponseDto, Settings } from '../types';

// URL для серверов в разных средах
const API_URLS = {
    node: isDevelopment ? 'http://localhost:5001' : ((import.meta as any).env?.VITE_NODE_API_URL || '/node-api'),
    deno: isDevelopment ? 'http://localhost:5002' : ((import.meta as any).env?.VITE_DENO_API_URL || '/deno-api'),
    bun: isDevelopment ? 'http://localhost:5003' : ((import.meta as any).env?.VITE_BUN_API_URL || '/bun-api')
};

// Функция для выполнения запроса к одному серверу
const runCodeInEnvironment = async (
    environment: 'node' | 'deno' | 'bun',
    code: string,
    timeout: number
): Promise<{
    status: string;
    data?: any;
    error?: string;
}> => {
    try {
        const response = await fetch(`${API_URLS[environment]}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                code,
                timeout
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error running code in ${environment}:`, error);
        return {
            status: 'error',
            error: error instanceof Error ? error.message : String(error)
        };
    }
};

// Основная функция для запуска кода во всех выбранных средах
export const runCodeAsync = async (
    {
        code,
        settings
    }: {
        code?: string;
        settings: Settings;
    }
): Promise<RunCodeResponseDto> => {
    try {
        const environments = Object.entries(settings.environments)
            .filter(([_, isEnabled]) => isEnabled)
            .map(([env]) => env as keyof EnvironmentData);

        // Создаем массив промисов для всех выбранных сред
        const promises = environments.map(env => 
            runCodeInEnvironment(env, code || '', settings.timeout)
        );

        // Ожидаем выполнения всех промисов
        const results = await Promise.all(promises);

        // Формируем результат
        const resultData = environments.reduce((acc, env, index) => {
            const result = results[index];
            
            if (result.status === 'success' && result.data) {
                acc[env] = result.data;
            } else {
                acc[env] = { 
                    error: result.error || 'Неизвестная ошибка',
                    executionTime: 0,
                    output: ''
                };
            }
            
            return acc;
        }, {} as EnvironmentData);

        return {
            status: 'success',
            data: resultData
        };
    } catch (error) {
        console.error('Error running code:', error);
        throw error;
    }
};

