import { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import CodeEditor from './components/CodeEditor';
import ResultsView from './components/ResultsView';
import SettingsPanel from './components/SettingsPanel';
import Header from './components/Header';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [code, setCode] = useState('// Введите ваш JavaScript код здесь\nconsole.log("Hello, World!");');
  const [results, setResults] = useState(null);
  const [settings, setSettings] = useState({
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '2fr 1fr' }}>
            <Box>
              <CodeEditor
                value={code}
                onChange={setCode}
              />
            </Box>
            <Box>
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
    </ThemeProvider>
  );
}

export default App; 