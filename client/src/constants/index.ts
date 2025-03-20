export const RUN_CODE_FAILED_REQUEST = 'Ошибка отправки запроса, попробуйте позже'
export const RUN_CODE_FATAL_CODE_ERROR = 'В коде присутствует ошибка. Исправьте её и попробуйте снова'

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
