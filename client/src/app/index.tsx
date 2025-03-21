import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
    Box,
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    CodeEditor,
    ResultsView,
    SettingsPanel,
    Header,
    PresetSelect
} from '../components';
import { RUN_CODE_FAILED_REQUEST, RUN_CODE_FATAL_CODE_ERROR } from '../constants';
import { EnvironmentData, Settings } from '../types';
import { runCodeAsync } from '../api';
import './styles.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

const AppContent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [code, setCode] = useState<string | undefined>(
        '// Введите ваш JavaScript код здесь или воспользуйтесь заготовками\nconsole.log("Hello, World!");'
    );
    const [results, setResults] = useState<EnvironmentData | null>(null);
    const [settings, setSettings] = useState<Settings>({
        timeout: 5000,
        runs: 3,
        environments: {
            node: true,
            deno: true,
            bun: true
        },
        mode: 'single'
    });

    const handleRunCode = () => {
        runCodeAsync({ code, settings })
            .then((response) => {
                if (response.status !== 'success') {
                    toast.error(RUN_CODE_FAILED_REQUEST);
                    return;
                }

                const hasErrorEnvironmentError = Object.values(response.data).some((env) => env.error);

                if (hasErrorEnvironmentError) {
                    toast.error(RUN_CODE_FATAL_CODE_ERROR);
                }

                setResults(response.data);
            })
            .catch(() => {
                toast.error(RUN_CODE_FAILED_REQUEST);
            });
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container
                maxWidth="xl"
                sx={{
                    mt: { xs: 2, sm: 4 },
                    mb: { xs: 2, sm: 4 },
                    flex: 1,
                    px: { xs: 1, sm: 2, md: 3 }
                }}
            >
                <Box sx={{
                    display: 'grid',
                    gap: { xs: 1, sm: 2 },
                    gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }
                }}>
                    <Box>
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            height={isMobile ? '40vh' : '70vh'}
                        />
                    </Box>
                    <Box>
                        <PresetSelect onChange={setCode} />
                        <SettingsPanel
                            settings={settings}
                            onSettingsChange={setSettings}
                            onRun={handleRunCode}
                        />
                        {results && (
                            <ResultsView settings={settings} results={results} />
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppContent />
            <Toaster position="top-center" />
        </ThemeProvider>
    );
};