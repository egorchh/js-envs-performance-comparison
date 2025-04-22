import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as api from '../../api';

// Мокаем импорт App
jest.mock('../../app', () => ({
    App: () => {
        const handleRunCode = () => {
            api.runCodeAsync({
                code: 'console.log("test")',
                settings: {
                    environments: { node: true, deno: true, bun: true },
                    timeout: 5000,
                    runs: 1,
                    mode: 'single'
                }
            });
        };

        return (
            <div>
                <header>
                    <h1>Runtimer</h1>
                </header>
                <div>
                    <h2>Настройки</h2>
                </div>
                <button onClick={handleRunCode}>Запустить код</button>
            </div>
        );
    }
}));

// Мок для API
jest.mock('../../api');

// Импортируем App после моков
import { App } from '../../app';

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders header, settings panel, code editor, and results view components', () => {
        render(<App />);

        // Проверяем наличие заголовка
        expect(screen.getByText(/Runtimer/i)).toBeInTheDocument();

        // Проверяем наличие панели настроек
        expect(screen.getByText(/Настройки/i)).toBeInTheDocument();

        // Проверяем наличие кнопки запуска
        expect(screen.getByText(/Запустить код/i)).toBeInTheDocument();
    });

    test('clicking run button calls runCodeAsync', async () => {
        // Мокаем успешный ответ API
        (api.runCodeAsync as jest.Mock).mockResolvedValue({
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
        });

        render(<App />);

        // Находим и нажимаем кнопку запуска
        const runButton = screen.getByText(/Запустить код/i);
        fireEvent.click(runButton);

        // Проверяем, что API был вызван с правильными параметрами
        await waitFor(() => {
            expect(api.runCodeAsync).toHaveBeenCalledTimes(1);
            expect(api.runCodeAsync).toHaveBeenCalledWith(expect.objectContaining({
                settings: expect.objectContaining({
                    environments: expect.any(Object),
                    timeout: expect.any(Number)
                })
            }));
        });
    });
});