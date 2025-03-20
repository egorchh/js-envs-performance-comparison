import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
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
import { Settings } from '../types';
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

    const [code, setCode] = useState<string | undefined>('// Введите ваш JavaScript код здесь\nconsole.log("Hello, World!");');
    const [results, setResults] = useState(null);
    const [settings, setSettings] = useState<Settings>({
        timeout: 5000,
        runs: 3,
        environments: {
            node: true,
            deno: true,
            bun: true
        },
        mode: 'single' // 'single' | 'average' | 'async'
    });

    const handleRunCode = async () => {
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

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error running code:', error);
        }
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
                        <PresetSelect />
                        <SettingsPanel
                            settings={settings}
                            onSettingsChange={setSettings}
                            onRun={handleRunCode}
                        />
                        {results && (
                            <ResultsView results={results} />
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