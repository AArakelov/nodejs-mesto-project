import { Router } from 'express';
import {
  createUser, getUserById, getUsers, updateUserAvatar, updateUserProfile,
} from '../controllers/user';

const router = Router();

// Маршруты для пользователей
router.get('/users', getUsers); // Маршрут для получения всех пользователей
router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);
export default router;
