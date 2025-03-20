export const resultViewBarOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Сравнение производительности',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};
