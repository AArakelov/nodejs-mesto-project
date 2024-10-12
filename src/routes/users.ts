import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getCurrentUser, getUserById, getUsers, updateUserAvatar, updateUserProfile,
} from '../controllers/user';
import { URL_LINK_PATTERNS } from '../utils/patterns';

const router = Router();

// Маршруты для пользователей
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
}), updateUserProfile);
router.get('/users/me', getCurrentUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_LINK_PATTERNS).required().messages({
      'string.pattern.base': 'Некорректный формат URL для аватара',
      'any.required': 'Поле avatar обязательно для заполнения',
    }),
  }),
}), updateUserAvatar);
export default router;
