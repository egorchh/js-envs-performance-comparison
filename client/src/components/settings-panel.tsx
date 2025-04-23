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
            <Typography variant="h6" gutterBottom>
                Настройки
            </Typography>

            <Stack spacing={{ xs: 1.5, sm: 2 }}>
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Среды исполнения
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 0.5, sm: 1 }
                    }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={settings.environments.node}
                                    onChange={() => handleEnvironmentChange('node')}
                                    size={isMobile ? "small" : "medium"}
                                />
                            }
                            label="Node.js"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={settings.environments.deno}
                                    onChange={() => handleEnvironmentChange('deno')}
                                    size={isMobile ? "small" : "medium"}
                                />
                            }
                            label="Deno"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={settings.environments.bun}
                                    onChange={() => handleEnvironmentChange('bun')}
                                    size={isMobile ? "small" : "medium"}
                                />
                            }
                            label="Bun"
                        />
                    </Box>
                </Box>

                <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                        Режим выполнения
                    </Typography>
                    <Select
                        value={settings.mode}
                        onChange={handleModeChange}
                        size={isMobile ? "small" : "medium"}
                    >
                        <MenuItem value="single">Одиночный запуск</MenuItem>
                        <MenuItem value="average">Среднее время</MenuItem>
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
                        size={isMobile ? "small" : "medium"}
                    />
                </FormControl>

                {settings.mode === 'average' && (
                    <FormControl fullWidth>
                        <Typography variant="subtitle2" gutterBottom>
                            Количество запусков
                        </Typography>
                        <TextField
                            value={settings.runs}
                            onChange={handleRunsChange}
                            size={isMobile ? "small" : "medium"}
                        />
                    </FormControl>
                )}

                <Button
                    variant="contained"
                    onClick={onRun}
                    fullWidth
                    disabled={pending}
                    size={isMobile ? "small" : "medium"}
                >
                    {pending ? 'Запуск...' : 'Запустить код'}
                </Button>
            </Stack>
        </Paper>
    );
}