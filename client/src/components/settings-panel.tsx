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
    Stack,
    useTheme,
    useMediaQuery,
    InputLabel,
    type SelectProps,
    type TextFieldProps
} from '@mui/material';
import { Settings } from '../types';

type Props = {
    settings: Settings;
    pending: boolean;
    onSettingsChange: (settings: Settings) => void;
    onRun: VoidFunction;
};

export const SettingsPanel = ({ settings, onSettingsChange, onRun, pending }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleEnvironmentChange = (environment: 'node' | 'deno' | 'bun') => {
        onSettingsChange({
            ...settings,
            environments: {
                ...settings.environments,
                [environment]: !settings.environments[environment]
            }
        });
    };

    const handleModeChange: SelectProps['onChange'] = (event) => {
        onSettingsChange({
            ...settings,
            mode: event.target.value as 'single' | 'average' | 'async'
        });
    };

    const handleTimeoutChange: TextFieldProps['onChange'] = (event) => {
        onSettingsChange({
            ...settings,
            timeout: Number(event.target.value)
        });
    };

    const handleCommonTimeoutChange: TextFieldProps['onChange'] = (event) => {
        onSettingsChange({
            ...settings,
            commonTimeout: Number(event.target.value)
        });
    };

    const handleRunsChange: TextFieldProps['onChange'] = (event) => {
        onSettingsChange({
            ...settings,
            runs: Number(event.target.value ?? 0)
        });
    };

    return (
        <Paper sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 1.5, sm: 2 }
        }}>
            <Typography variant="h6" component="h2" gutterBottom>
                Настройки
            </Typography>

            <Stack spacing={{ xs: 1.5, sm: 2 }} role="form" aria-label="Настройки запуска кода">
                <Box>
                    <Typography variant="subtitle2" component="h3" gutterBottom id="env-group-label">
                        Среды исполнения
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 0.5, sm: 1 }
                    }}
                        role="group"
                        aria-labelledby="env-group-label">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={settings.environments.node}
                                    onChange={() => handleEnvironmentChange('node')}
                                    size='small'
                                    inputProps={{ 'aria-label': 'Выбрать Node.js' }}
                                />
                            }
                            label="Node.js"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={settings.environments.deno}
                                    onChange={() => handleEnvironmentChange('deno')}
                                    size='small'
                                    inputProps={{ 'aria-label': 'Выбрать Deno' }}
                                />
                            }
                            label="Deno"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={settings.environments.bun}
                                    onChange={() => handleEnvironmentChange('bun')}
                                    size='small'
                                    inputProps={{ 'aria-label': 'Выбрать Bun' }}
                                />
                            }
                            label="Bun"
                        />
                    </Box>
                </Box>

                <FormControl fullWidth>
                    <Typography variant="subtitle2" component="h3" gutterBottom id="mode-label">
                        Режим выполнения
                    </Typography>
                    <Select
                        value={settings.mode}
                        onChange={handleModeChange}
                        size='small'
                        aria-labelledby="mode-label"
                        inputProps={{ 'aria-label': 'Выберите режим выполнения' }}
                    >
                        <MenuItem value="single">Одиночный запуск</MenuItem>
                        <MenuItem value="average">Среднее время</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth>
                    <Typography variant="subtitle2" component="h3" gutterBottom id="timeout-label">
                        Таймаут одного прогона (мс)
                    </Typography>
                    <TextField
                        type="number"
                        value={settings.timeout}
                        onChange={handleTimeoutChange}
                        size='small'
                        aria-labelledby="timeout-label"
                        inputProps={{
                            'aria-label': 'Введите таймаут одного прогона в миллисекундах',
                            min: 100
                        }}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <Typography variant="subtitle2" component="h3" gutterBottom id="common-timeout-label">
                        Общий таймаут запуска (мс)
                    </Typography>
                    <TextField
                        type="number"
                        value={settings.commonTimeout}
                        onChange={handleCommonTimeoutChange}
                        size='small'
                        aria-labelledby="common-timeout-label"
                        inputProps={{
                            'aria-label': 'Введите общий таймаут запуска в миллисекундах',
                            min: 1000
                        }}
                    />
                </FormControl>

                {settings.mode === 'average' && (
                    <FormControl fullWidth>
                        <Typography variant="subtitle2" component="h3" gutterBottom id="runs-label">
                            Количество запусков
                        </Typography>
                        <TextField
                            value={settings.runs}
                            onChange={handleRunsChange}
                            size='small'
                            aria-labelledby="runs-label"
                            type="number"
                            inputProps={{
                                'aria-label': 'Введите количество запусков',
                                min: 1
                            }}
                        />
                    </FormControl>
                )}

                <Button
                    variant="outlined"
                    onClick={onRun}
                    fullWidth
                    disabled={pending}
                    size={isMobile ? "medium" : "large"}
                    aria-busy={pending}
                >
                    {pending ? 'Запуск...' : 'Запустить код'}
                </Button>
            </Stack>
        </Paper>
    );
}