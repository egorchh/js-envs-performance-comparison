export const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment ? 
    'http://localhost:5555' : 
    (import.meta.env.VITE_API_URL || 'https://js-envs-performance-comparison-8cefb3e43324.herokuapp.com');

export const RUN_CODE_FAILED_REQUEST = 'Ошибка отправки запроса, попробуйте позже';
export const RUN_CODE_FATAL_CODE_ERROR = 'В коде присутствует ошибка. Исправьте её и попробуйте снова';

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
