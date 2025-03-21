import { AppError } from './error.middleware.js';

export const validateRunCodeRequest = (req, res, next) => {
    const { code, settings } = req.body;

    if (!code) {
        return next(new AppError('Code is required', 400));
    }

    if (!settings) {
        return next(new AppError('Settings are required', 400));
    }

    const { environments, timeout, runs, mode } = settings;

    if (!environments || typeof environments !== 'object') {
        return next(new AppError('Invalid environments settings', 400));
    }

    if (timeout && typeof timeout !== 'number') {
        return next(new AppError('Timeout must be a number', 400));
    }

    if (runs && typeof runs !== 'number') {
        return next(new AppError('Runs must be a number', 400));
    }

    if (mode && !['single', 'average', 'async'].includes(mode)) {
        return next(new AppError('Invalid mode', 400));
    }

    const hasAtLeastOneEnvironment = Object.values(environments).some(value => value === true);
    if (!hasAtLeastOneEnvironment) {
        return next(new AppError('At least one environment must be selected', 400));
    }

    next();
}; 