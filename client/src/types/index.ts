export type Settings = {
    timeout: number;
    runs: number;
    environments: {
        node: boolean;
        deno: boolean;
        bun: boolean;
    };
    mode: 'single' | 'average' | 'async';
};

export type EnvResponseDto = {
    output: string;
    error?: string;
    executionTime: number;
    averageTime?: number;
    totalTime?: number;
}

export type EnvironmentData = {
    node?: EnvResponseDto;
    deno?: EnvResponseDto;
    bun?: EnvResponseDto;
};

export type RunCodeResponseDto = {
    status: string;
    data: EnvironmentData;
};

// Объявление для Vite environment variables
interface ImportMetaEnv {
    readonly VITE_NODE_API_URL?: string;
    readonly VITE_DENO_API_URL?: string;
    readonly VITE_BUN_API_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
