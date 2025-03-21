import { useMemo } from 'react';
import { Paper, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { resultViewBarOptions } from '../constants';
import { ResultError } from './result-error';
import { EnvironmentData, Settings } from "../types";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Props = {
    results: EnvironmentData;
    settings: Settings;
};

export const ResultsView = ({ results, settings }: Props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const chartData = useMemo(() => ({
        labels: Object.keys(results),
        datasets: [
            {
                label: `${settings.mode === 'average' ? 'Ср. время' : 'Время'} выполнения (мс)`,
                data: Object.values(results).map(r => r.averageTime || r.executionTime),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    }), [results, settings.mode]);

    const chartOptions = useMemo(() => ({
        ...resultViewBarOptions,
        plugins: {
            ...resultViewBarOptions.plugins,
            legend: {
                ...resultViewBarOptions.plugins.legend,
                labels: {
                    ...resultViewBarOptions.plugins.legend.labels,
                    font: {
                        size: isMobile ? 10 : 12
                    }
                }
            },
            title: {
                ...resultViewBarOptions.plugins.title,
                font: {
                    size: isMobile ? 12 : 16
                }
            }
        }
    }), [isMobile]);

    return (
        <Paper sx={{
            p: { xs: 1.5, sm: 2 },
            mt: { xs: 1.5, sm: 2 }
        }}>
            <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                gutterBottom
                sx={{
                    fontSize: {
                        xs: '1rem',
                        sm: '1.25rem'
                    }
                }}
            >
                Результаты
            </Typography>

            <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Bar data={chartData} options={chartOptions} />
            </Box>

            {Object.entries(results).map(([env, result]) => (
                <Box key={env} sx={{ mb: { xs: 1.5, sm: 2 } }}>
                    <Typography
                        variant={isMobile ? "subtitle2" : "subtitle1"}
                        gutterBottom
                        sx={{
                            fontSize: {
                                xs: '0.9rem',
                                sm: '1rem'
                            }
                        }}
                    >
                        {env}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            fontSize: {
                                xs: '0.8rem',
                                sm: '0.875rem'
                            }
                        }}
                    >
                        {settings.mode === 'average' ? 'Среднее время' : 'Время'} выполнения: {result.averageTime || result.executionTime} (мс)
                        {result.totalTime && (
                            <>
                                <br />
                                Общее время: {result.totalTime} (мс)
                            </>
                        )}
                    </Typography>
                    {result.output && (
                        <Box sx={{
                            mt: { xs: 0.5, sm: 1 },
                            p: { xs: 0.75, sm: 1 },
                            bgcolor: 'background.paper',
                            borderRadius: 1
                        }}>
                            <Typography
                                variant="body2"
                                component="pre"
                                sx={{
                                    whiteSpace: 'pre-wrap',
                                    fontSize: {
                                        xs: '0.75rem',
                                        sm: '0.875rem'
                                    }
                                }}
                            >
                                {result.output}
                            </Typography>
                        </Box>
                    )}
                    {result.error && (
                        <Typography
                            variant="body2"
                            color="error.main"
                            sx={{
                                mt: { xs: 0.5, sm: 1 },
                                fontSize: {
                                    xs: '0.75rem',
                                    sm: '0.875rem'
                                }
                            }}
                        >
                            <ResultError error={result.error} />
                        </Typography>
                    )}
                </Box>
            ))}
        </Paper>
    );
};