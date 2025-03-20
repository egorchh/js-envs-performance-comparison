export const resultViewBarOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                font: {
                    size: 12
                }
            }
        },
        title: {
            display: true,
            text: 'Сравнение производительности',
            font: {
                size: 16
            }
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};
