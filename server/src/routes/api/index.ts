import express from 'express';
import userHandler from './users';

const router = express.Router();

router.use('/users', userHandler);

export default router;
