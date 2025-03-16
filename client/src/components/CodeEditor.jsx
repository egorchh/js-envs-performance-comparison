import { Box, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';

function CodeEditor({ value, onChange }) {
  const handleEditorChange = (newValue) => {
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

export default CodeEditor; 