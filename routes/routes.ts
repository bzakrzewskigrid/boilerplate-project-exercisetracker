import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { createExercise } from '../controllers/exercisesController';
import { getLogs } from '../controllers/logsController';

const router = Router();

// todo: fix 'as any'
router.post('/users', createUser as any);
router.get('/users', getUsers as any);
router.post('/users/:_id/exercises', createExercise as any);
router.get('/users/:_id/logs', getLogs as any);

export default router;
