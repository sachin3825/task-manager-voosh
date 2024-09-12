import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controller/task.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.use(auth);

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
