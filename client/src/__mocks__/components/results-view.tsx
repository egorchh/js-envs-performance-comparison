import React from 'react';
import { EnvironmentData, Settings } from '../../types';

export const ResultsView = ({
    data,
    settings,
    isLoading,
    error
}: {
    data?: EnvironmentData;
    settings: Settings;
    isLoading: boolean;
    error?: string;
}) => {
    return (
        <div data-testid="results-view">
            {isLoading && <div>Загрузка...</div>}
            {error && <div>{error}</div>}
            {data && <div>Результаты выполнения кода</div>}
        </div>
    );
}; 