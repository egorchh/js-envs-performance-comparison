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
    averageTime: number;
    totalTime?: number | undefined;
}

export type EnvironmentData = {
    node: EnvResponseDto;
    deno: EnvResponseDto;
    bun: EnvResponseDto;
};

export type RunCodeResponseDto = {
    status: string;
    data: EnvironmentData;
};
