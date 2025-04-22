import { useState } from 'react';
import { Settings, EnvironmentData } from '../../types';

export const App = () => {
    const [settings, setSettings] = useState<Settings>({
        timeout: 5000,
        runs: 1,
        environments: {
            node: true,
            deno: true,
            bun: true
        },
        mode: 'single'
    });
    const [code, setCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [results, setResults] = useState<EnvironmentData | undefined>();

    const handleRunCode = async () => {
        // Логика запуска кода...
    };

    return (
        <div className="app">
            <header>
                <h1>Runtimer</h1>
            </header>
            <main>
                <div className="settings">
                    <h2>Настройки</h2>
                </div>
                <div className="code-editor">
                    <div>Редактор кода</div>
                </div>
                <button onClick={handleRunCode}>
                    Запустить код
                </button>
                <div className="results">
                    <h2>Результаты</h2>
                </div>
            </main>
        </div>
    );
}; 