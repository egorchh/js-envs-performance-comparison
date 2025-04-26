import { Dispatch, SetStateAction } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Editor, { Monaco } from '@monaco-editor/react';
import styles from './styles.module.css';

type Props = {
    value?: string;
    height?: string;
    onChange: Dispatch<SetStateAction<string | undefined>>;
};

// Определяем высококонтрастную тему для редактора
const defineHighContrastTheme = (monaco: Monaco) => {
    monaco.editor.defineTheme('high-contrast-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            // Улучшаем контрастность для различных элементов синтаксиса
            { token: 'comment', foreground: '#7ca668', fontStyle: 'italic' },
            { token: 'keyword', foreground: '#f08080', fontStyle: 'bold' },
            { token: 'string', foreground: '#ffd700' },
            { token: 'number', foreground: '#ff9e64' },
            { token: 'regexp', foreground: '#ff9e64' },
            { token: 'operator', foreground: '#89ddff' },
            { token: 'namespace', foreground: '#9ccfd8' },
            { token: 'type', foreground: '#c099ff' },
            { token: 'struct', foreground: '#c099ff' },
            { token: 'class', foreground: '#c099ff' },
            { token: 'interface', foreground: '#c099ff' },
            { token: 'enum', foreground: '#c099ff' },
            { token: 'typeParameter', foreground: '#c099ff' },
            { token: 'function', foreground: '#82aaff' },
            { token: 'member', foreground: '#add8e6' },
            { token: 'macro', foreground: '#f08080' },
            { token: 'variable', foreground: '#e0e0e0' },
            { token: 'parameter', foreground: '#e0e0e0' },
            { token: 'property', foreground: '#add8e6' },
            { token: 'enumMember', foreground: '#add8e6' },
            { token: 'event', foreground: '#add8e6' },
            { token: 'method', foreground: '#82aaff' },
            { token: 'decorator', foreground: '#f08080' },
            { token: 'label', foreground: '#f08080' },
        ],
        colors: {
            'editor.background': '#1a1a1a',
            'editor.foreground': '#ffffff',
            'editorLineNumber.foreground': '#c0c0c0',
            'editorCursor.foreground': '#ffffff',
            'editor.selectionBackground': '#264f78',
            'editor.selectionHighlightBackground': '#264f78',
            'editorSuggestWidget.background': '#1a1a1a',
            'editorSuggestWidget.foreground': '#ffffff',
            'editorSuggestWidget.selectedBackground': '#264f78',
            'input.background': '#1a1a1a',
            'input.foreground': '#ffffff',
        }
    });
};

export const CodeEditor = ({ value, onChange, height = '70vh' }: Props) => {
    const handleEditorChange = (newValue?: string) => {
        onChange(newValue);
    };

    // Никакой useEffect не требуется, так как тема определяется в beforeMount

    return (
        <Paper sx={{ height }}>
            <Typography
                variant="h6"
                component="h2"
                id="code-editor-label"
                sx={{ p: 2, pb: 1 }}
                aria-hidden="false"
            >
                Редактор кода
            </Typography>
            <Box sx={{ height: 'calc(100% - 40px)' }}>
                <Editor
                    height="100%"
                    className={styles.editor}
                    defaultLanguage="javascript"
                    theme="high-contrast-dark"
                    value={value}
                    onChange={handleEditorChange}
                    aria-labelledby="code-editor-label"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        accessibilitySupport: 'on',
                        // Высококонтрастные настройки
                        fontLigatures: false,
                        lineHeight: 20,
                        renderLineHighlight: 'gutter',
                        colorDecorators: true,
                        fontFamily: 'Consolas, "Courier New", monospace',
                    }}
                    beforeMount={(monaco) => {
                        defineHighContrastTheme(monaco);
                    }}
                />
            </Box>
        </Paper>
    );
}