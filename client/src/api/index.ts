import {RunCodeResponseDto, Settings} from '../types';

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
        const response = await fetch('/api/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
                settings
            }),
        });

        return response.json();
    } catch (error) {
        console.error('Error running code:', error);
        throw error;
    }
};

