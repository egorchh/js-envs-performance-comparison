import { Dispatch } from 'react';
import { Box, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';

type Props = {
    value?: string;
    onChange: Dispatch<React.SetStateAction<string | undefined>>;
};

export const CodeEditor = ({ value, onChange }: Props) => {
    const handleEditorChange = (newValue?: string) => {
        onChange(newValue);
    };

    return (
        <Paper sx={{ height: '70vh' }}>
            <Box sx={{ height: '100%' }}>
                <Editor
                    height="100%"
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