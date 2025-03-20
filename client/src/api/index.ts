import {RunCodeResponseDto, Settings} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://js-envs-performance-comparison-8cefb3e43324.herokuapp.com';

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
        const response = await fetch(`${API_URL}/api/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                code,
                settings
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error running code:', error);
        throw error;
    }
};

