import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack
} from '@mui/material';

function SettingsPanel({ settings, onSettingsChange, onRun }) {
  const handleEnvironmentChange = (env) => {
    onSettingsChange({
      ...settings,
      environments: {
        ...settings.environments,
        [env]: !settings.environments[env]
      }
    });
  };

  const handleModeChange = (event) => {
    onSettingsChange({
      ...settings,
      mode: event.target.value
    });
  };

  const handleTimeoutChange = (event) => {
    onSettingsChange({
      ...settings,
      timeout: Number(event.target.value)
    });
  };

  const handleRunsChange = (event) => {
    onSettingsChange({
      ...settings,
      runs: Number(event.target.value)
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Настройки
      </Typography>
      
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Среды исполнения
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.environments.node}
                onChange={() => handleEnvironmentChange('node')}
              />
            }
            label="Node.js"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.environments.deno}
                onChange={() => handleEnvironmentChange('deno')}
              />
            }
            label="Deno"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.environments.bun}
                onChange={() => handleEnvironmentChange('bun')}
              />
            }
            label="Bun"
          />
        </Box>

        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            Режим выполнения
          </Typography>
          <Select
            value={settings.mode}
            onChange={handleModeChange}
            size="small"
          >
            <MenuItem value="single">Одиночный запуск</MenuItem>
            <MenuItem value="average">Среднее время</MenuItem>
            <MenuItem value="async">Асинхронный</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            Таймаут (мс)
          </Typography>
          <TextField
            type="number"
            value={settings.timeout}
            onChange={handleTimeoutChange}
            size="small"
          />
        </FormControl>

        {settings.mode === 'average' && (
          <FormControl fullWidth>
            <Typography variant="subtitle2" gutterBottom>
              Количество запусков
            </Typography>
            <TextField
              type="number"
              value={settings.runs}
              onChange={handleRunsChange}
              size="small"
            />
          </FormControl>
        )}

        <Button
          variant="contained"
          onClick={onRun}
          fullWidth
        >
          Запустить
        </Button>
      </Stack>
    </Paper>
  );
}

export default SettingsPanel; 