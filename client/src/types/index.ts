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
