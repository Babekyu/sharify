import express from 'express';
import apiHandler from './api';

const router = express.Router();

router.use('/api', apiHandler);

export default router;
