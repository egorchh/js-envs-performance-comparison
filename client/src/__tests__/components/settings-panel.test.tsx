import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsPanel } from '../../components/settings-panel';
import { Settings } from '../../types';

const mockSettings: Settings = {
    timeout: 5000,
    runs: 3,
    environments: {
        node: true,
        deno: true,
        bun: true
    },
    mode: 'single'
};

describe('SettingsPanel Component', () => {
    const mockOnSettingsChange = jest.fn();
    const mockOnRun = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all environment options', () => {
        render(
            <SettingsPanel
                settings={mockSettings}
                onSettingsChange={mockOnSettingsChange}
                onRun={mockOnRun}
                pending={false}
            />
        );

        expect(screen.getByText('Node.js')).toBeInTheDocument();
        expect(screen.getByText('Deno')).toBeInTheDocument();
        expect(screen.getByText('Bun')).toBeInTheDocument();
    });

    test('clicking run button calls the onRun function', () => {
        render(
            <SettingsPanel
                settings={mockSettings}
                onSettingsChange={mockOnSettingsChange}
                onRun={mockOnRun}
                pending={false}
            />
        );

        const runButton = screen.getByText('Запустить код');
        fireEvent.click(runButton);

        expect(mockOnRun).toHaveBeenCalledTimes(1);
    });

    test('run button is disabled when pending is true', () => {
        render(
            <SettingsPanel
                settings={mockSettings}
                onSettingsChange={mockOnSettingsChange}
                onRun={mockOnRun}
                pending={true}
            />
        );

        const runButton = screen.getByText('Запуск...');
        expect(runButton).toBeDisabled();
    });
}); 