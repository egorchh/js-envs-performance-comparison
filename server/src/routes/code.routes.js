import { Router } from 'express';
import { runCode } from '../controllers/code.controller.js';
import { validateRunCodeRequest } from '../middleware/validation.middleware.js';

const router = Router();

router.post('/run', validateRunCodeRequest, runCode);

export default router; 