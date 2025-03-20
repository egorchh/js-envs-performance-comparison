import { Dispatch } from 'react';
import { Box, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';
import styles from './styles.module.css';

type Props = {
    value?: string;
    onChange: Dispatch<React.SetStateAction<string | undefined>>;
    height?: string;
};

export const CodeEditor = ({ value, onChange, height = '70vh' }: Props) => {
    const handleEditorChange = (newValue?: string) => {
        onChange(newValue);
    };

    return (
        <Paper sx={{ height }}>
            <Box sx={{ height: '100%' }}>
                <Editor
                    height="100%"
                    className={styles.editor}
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={value}
                    onChange={handleEditorChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on'
                    }}
                />
            </Box>
        </Paper>
    );
}