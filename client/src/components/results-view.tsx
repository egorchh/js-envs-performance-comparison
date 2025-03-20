import { Paper, Typography, Box } from '@mui/material';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type Props = {
    results: Record<string, {
        averageTime: number,
        executionTime: number,
        output: string,
        error: string
    }>;
};

export const ResultsView = ({ results }: Props) => {
    const chartData = {
        labels: Object.keys(results),
        datasets: [
            {
                label: 'Время выполнения (мс)',
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
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Результаты
            </Typography>

            <Box sx={{ mb: 2 }}>
                <Bar data={chartData} options={resultViewBarOptions} />
            </Box>

            {Object.entries(results).map(([env, result]) => (
                <Box key={env} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {env}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Время выполнения: {result.averageTime || result.executionTime} мс
                    </Typography>
                    {result.output && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                {result.output}
                            </Typography>
                        </Box>
                    )}
                    {result.error && (
                        <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                            Ошибка: {result.error}
                        </Typography>
                    )}
                </Box>
            ))}
        </Paper>
    );
}