import { runInEnvironments } from '../runners/index.js';
import { AppError } from '../middleware/error.middleware.js';

export const runCode = async (req, res, next) => {
    try {
        const { code, settings } = req.body;
        const results = await runInEnvironments(code, settings);

        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (error) {
        next(new AppError(error.message, 500));
    }
}; 