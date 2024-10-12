import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, deleteCard, dislikeCard, getCards, likeCard,
} from '../controllers/cards';
import { URL_LINK_PATTERNS } from '../utils/patterns';

const router = Router();

// Маршруты для карточек
router.get('/cards', getCards);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Название карточки должно быть не менее 2 символов',
        'string.max': 'Название карточки должно быть не более 30 символов',
        'any.required': 'Поле name обязательно для заполнения',
      }),
    link: Joi.string().pattern(URL_LINK_PATTERNS).required().messages({
      'string.pattern.base': 'Некорректный формат ссылки',
      'any.required': 'Поле link обязательно для заполнения',
    }),
  }),
}), createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.length': 'ID карточки должен быть длиной 24 символа',
        'any.required': 'ID карточки обязателен',
      }),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.length': 'ID карточки должен быть длиной 24 символа',
        'any.required': 'ID карточки обязателен',
      }),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.length': 'ID карточки должен быть длиной 24 символа',
        'any.required': 'ID карточки обязателен',
      }),
  }),
}), dislikeCard);
export default router;
